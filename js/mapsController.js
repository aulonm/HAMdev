/**
 * Created by aulon on 11/22/2015.
 *
 *  Tings not done:
 *      - Create a new unit
 *          - Is somewhat done, missing coordinates though. Think of waiting until markers are done, and then
 *          try it out (Magnurh coordinates are added. Not tested)
 *          - Not tested
 *      - Update a unit
 *          -
 *      - Markers
 *          - Not implemented
 *      - Search function
 *          - Implemented getting different levels out, when changing the select-list
 *              - Not done with level 4
 *          - Tbh I can't find out how to implement search functions by searching for names, only ID's. Can check this
 *            mot thoroughly at a later date.
 *
 *  Things Done (Magnus):
 *      - Click on map: Custom marker
 *          - a $scope variable customMarker keeps track of a user-defined marker (I wanted to keep this separate
 *            from the result markers). It gets updated either by clicking on the map, or by looking up user location.
 *
 *  If there are more things that I have not listed, then write them here
 *  Have you implemented one of them, then write which you have written, so that it is easier to coordinate!
 *  Happy coding
 *  - Aulon
 */
(function (controllers) {
    controllers.controller("mapsCtrl", ["apiService","$scope", "uiGmapGoogleMapApi", "uiGmapIsReady", '$location',
        function (apiService, $scope, uiGmapGoogleMapApi, uiGmapIsReady, $location) {

            var vm = this;

            var currentMapCenter = {latitude: 8.536426, longitude: -11.896692};
            var currentMapZoom = 8;
            $scope.facilityMarkersReady = false;

            $scope.legallyCreateCustomMarker = false;
            $scope.mapClicked = false;
            $scope.customMarker = { idKey: "001", coords: {}};

            $scope.oneAtATime = true;
            $scope.level = 0;



            // $watch brukes som en slags while-loop som sjekker kontinuerlig
            // om den variabelen blir endret eller ikke. Hvis den blir endra i search-delen, så henter den annen
            // informasjon :)
            // Ser så hacky ut at jeg blir kvalm
            $scope.search = function(){
                console.log("new search, name: " + $scope.searchName)
                apiService.getFacilities($scope.searchName, $scope.level).get(function(result) {
                    $scope.facilities = result.organisationUnits;
                    //console.log(result.organisationUnits);
                    if($scope.level == 2 || $scope.level == 3) {
                        polygonsOnMap();
                    }
                    else if($scope.level == 4) {
                        markersOnMap();
                    }
                });
            };

            init();
            function init(){
                var setMainMap = function(){
                    $scope.map = {
                        center: currentMapCenter,
                        zoom: currentMapZoom,
                        events: {
                            click: function (mapObject, eventName, originalEventArgs) {
                                if ($scope.legallyCreateCustomMarker) {
                                    var e = originalEventArgs[0];
                                    $scope.customMarker.coords = {latitude: e.latLng.lat(), longitude: e.latLng.lng()};
                                    $scope.mapClicked = true;
                                    console.log("Map was clicked: " + $scope.mapClicked);
                                    console.log("Lat: " + $scope.customMarker.coords.latitude + " Long: " + $scope.customMarker.coords.longitude);

                                    //magnurh: WTF - hvorfor får dette det til å fungere?????????
                                    // Her henter vi data fra server - gjør at kartet lastes med den nye markeren
                                    apiService.makeMapLoad().get();
                                }
                            }
                        }
                    };
                };
                setMainMap();
            }

            function markersOnMap(){
                $scope.unitMarkers = [];
                if ($scope.level != 4) return;

                function pushMarkersToMap(id, facility){

                    if(!facility.coordinates){
                        console.log("No coordinates available for "+id);
                        return;
                    }
                    console.log("Coordinates for "+id+":");
                    var geoData = JSON.parse(facility.coordinates);
                    console.log(facility.name);
                    console.log(geoData);

                    $scope.unitMarkers.push({
                        id: id,
                        name: facility.name,
                        coords: {
                            latitude: geoData[1],
                            longitude: geoData[0]
                        },
                        options: {
                            labelContent: facility.shortName,
                            labelClass: 'marker-labels',
                            labelAnchor: "28 0"
                        }
                    });

                }
                for (id in $scope.facilities){
                    var facility = $scope.facilities[id];
                    pushMarkersToMap(id, facility);
                }
                $scope.facilityMarkersReady = true;
            }

            function polygonsOnMap(){
                // All the polygons are here
                $scope.unitPolygons = [];

                // Goes through a facility/district and adds its polygons to one
                // array, and then pushes that array to the outer array which is called
                // unitPolygons
                function pushPolygonsToMap(id, facility){
                    // Local array with local polygons
                    var coordinates = [];
                    //if(id == 2){
                    //    console.log(id + "     " + facility.coordinates);
                    //}

                    // If there are noe coordinates, then just return
                    if(!facility.coordinates){
                        //console.log("NOTHING HERE")
                        return;
                    }

                    // Parses the json and puts it in an 2Darray geoData
                    var geoData = JSON.parse(facility.coordinates)[0][0];
                    //if(id == 2){
                    //    console.log(id + "     " + geoData);
                    //}

                    // Add each coordinate to the coordinates-array
                    for (var i = 0; i < geoData.length; i++){
                        var x = geoData[i][0];
                        var y = geoData[i][1];
                        coordinates.push({latitude: y, longitude: x});

                    }/*
                    if(id == 2){
                        console.log(id + "     " + coordinates);
                    }*/

                    // Adds the information into the outer array unitPolygons
                    $scope.unitPolygons.push({
                        id: id,
                        path: coordinates,
                        stroke: {
                            color: '#6060FB',
                            weight: 3
                        },
                        editable: false,
                        draggable: false,
                        geodesic: false,
                        visible: true
                    });
                }

                // løper gjennom alle faficlities og henter ut coordinates
                for (var id in $scope.facilities){
                    var facility = $scope.facilities[id];
                    pushPolygonsToMap(id, facility);
                }
                //console.log($scope.unitPolygons)
            }

            $scope.setNewCenter = function() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        var center = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        };
                        currentMapCenter = center;
                        $scope.customMarker.coords = center;
                        $scope.mapClicked = true;

                        //Her må kartet lastes på nytt. Kan eventuelt fikses med panTo()
                        init();

                        //magnurh: WTF - hvorfor får dette det til å fungere?????????
                        // Her henter vi data fra server - gjør at kartet lastes med den nye markeren
                        apiService.makeMapLoad().get();

                        console.log("Map was clicked: "+$scope.mapClicked);
                        console.log("Lat: "+$scope.customMarker.coords.latitude+" Long: "+$scope.customMarker.coords.longitude);
                    });
                } else {
                    /* We are not allowed to track location */
                }
            };


            // Save button from website
            // sets the names that where written on the different
            // input forms, then does a save-function to push to
            // database
            // NOT TRIED LOL
            $scope.saveNewUnit = function(){
                var newUnitLatitude = $scope.newUnit.latitude;
                if (!newUnitLatitude && $scope.customMarker.coords.latitude) newUnitLatitude = $scope.customMarker.coords.latitude.toString();
                var newUnitLongitude = $scope.newUnit.longitude;
                if (!newUnitLongitude && $scope.customMarker.coords.longitude) newUnitLongitude = $scope.customMarker.coords.longitude.toString();

                console.log($scope.newUnit.latitude);
                console.log($scope.newUnit.longitude);
                console.log($scope.newUnit.level);
                console.log($scope.newUnit.code);
                console.log($scope.newUnit.parentId);

                // coordinates are not saved properly
                var unit = {
                    name: $scope.newUnit.name,
                    shortName: $scope.newUnit.shortName,
                    description: $scope.newUnit.description,
                    code: $scope.newUnit.code,
                    //featureType: 'POINT',
                    coordinates: "["+newUnitLongitude+", "+newUnitLatitude+"]",
                    level: parseInt($scope.newUnit.level),
                    openingDate: new Date(),
                    parent: { id: $scope.newUnit.parentId }
                };
                console.log(unit);
                apiService.createUnit().save(unit, function(){
                    $location.path('/');
                });
            };

            $scope.updateUnit = function(facility) {
               /* console.log("updateUnit :\n\tid: " + newId + "\n\tname: " + newName + "\n\tshortName: " + newShortName);
                var unit = {
                    id: newId,
                    name: newName,
                    shortName: newShortName
                };*/
                console.log(facility);
                apiService.updateUnit(facility.id).update(facility, function(){
                    $location.path('/');
                });
            };











            // Do stuff with your $scope.
            // Note: Some of the directives require at least something to be defined originally!
            // e.g. $scope.markers = []

            // uiGmapGoogleMapApi is a promise.
            // The "then" callback function provides the google.maps object.
            /*uiGmapGoogleMapApi.then(function (maps) {
                $scope.map = {
                    center: {latitude: 8.536426, longitude:  -11.896692},
                    zoom: 8,
                    events: {
                        setCenter: function () {
                            if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition(function (position) {
                                    var center = {
                                        latitude: position.coords.latitude,
                                        longitude: position.coords.longitude
                                    }
                                    $scope.map.center = center;
                                });
                            } else {
                                /!* We are not allowed to track location *!/
                            }
                        }
                    },
                    /!* Dummy data for showing Markers and Polygons *!/
                    markers: [
                        {
                            id: 1,
                            latitude: 45,
                            longitude: -74,
                            showWindow: false,
                            options: {}
                        },
                        {
                            id: 2,
                            latitude: 45.1,
                            longitude: -74.1,
                            showWindow: false,
                        }
                    ],
                    polygons: [
                        {
                            id: 1,
                            path: [
                                {
                                    latitude: 44.8,
                                    longitude: -74
                                },
                                {
                                    latitude: 45,
                                    longitude: -74.2
                                },
                                {
                                    latitude: 44.99,
                                    longitude: -74.8,
                                },
                                {
                                    latitude: 45.092,
                                    longitude: -75
                                },
                                {
                                    latitude: 44.2,
                                    longitude: -75
                                },
                                {
                                    latitude: 44.4,
                                    longitude: -75.2
                                }
                            ],
                            stroke: {
                                color: '#1B4C7E',
                                weight: 2
                            },
                            editable: false,
                            draggable: false,
                            geodesic: false,
                            visible: true,
                            fill: {
                                color: '#2466A8',
                                opacity: 0.3
                            }
                        }
                    ]
                };
            });*/
        }]);


})(angular.module('mainControllers'));
