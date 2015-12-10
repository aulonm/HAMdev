/**
 * Created by aulon on 11/22/2015.
 *
 *  Tings not done:
 *      - Create a new unit
 *          - Is somewhat done, missing coordinates though. Think of waiting until markers are done, and then
 *          try it out
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
 *
 *  If there are more things that I have not listed, then write them here
 *  Have you implemented one of them, then write which you have written, so that it is easier to coordinate!
 *  Happy coding
 *  - Aulon
 */
(function (controllers) {
    controllers.controller("mapsCtrl", ["apiService","$scope", "uiGmapGoogleMapApi", "uiGmapIsReady", '$location',
        function (apiService, $scope, uiGmapGoogleMapApi, uiGmapIsReady, $location) {
            $scope.oneAtATime = true;
            $scope.level = 0;


            // $watch brukes som en slags while-loop som sjekker kontinuerlig
            // om den variabelen blir endret eller ikke. Hvis den blir endra i search-delen, så henter den annen
            // informasjon :)
            // Ser så hacky ut at jeg blir kvalm
            $scope.$watch('level', function(){
                if ($scope.leve == 0){
                    // Do we want to get everything here?
                    // Like every single entity from the database (about 1300 entities..)
                }else{
                    apiService.getFacilitiesOnLevel($scope.level).get(function(result){
                        if($scope.level == 4){
                            // THIS IS FOR THE LAST LEVEL, MAYBE PLOT ALL THE MARKERS? NOT SURE
                            // Get some other information and not the same as the others, since
                            // the others are getting polygons and such, while level 4 doesnt have that
                            // It only has coordinates as points, maybe make a new function in api.js
                            // that gets this one specific level?
                            return;
                        }
                        $scope.facilities = result.organisationUnits;
                        polygonsOnMap();
                    });
                }
            });


            init();
            function init(){
                var setMainMap = function(){
                    $scope.map = {center: apiService.currentMapCenter, zoom: 8};
                };
                apiService.getFacilitiesOnLevel(1).get(function(result){
                    $scope.facilities = result.organisationUnits;
                    //$scope.levelParent = $scope.facilities[0].parent;
                    //console.log($scope.facilities[2].coordinates);
                    polygonsOnMap();
                    setMainMap();
                })
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
                        apiService.currentMapCenter = center;
                        init();
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
                var unit = {
                    name: $scope.newUnit.name,
                    shortName: $scope.newUnit.shortName,
                    description: $scope.newUnit.description,
                    code: $scope.newUnit.newCode,
                    parent: $scope.newUnit.newParent
                };
                apiService.createUnit().save(unit, function(){
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