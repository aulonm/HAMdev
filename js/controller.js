/**
 * Created by HAMdev on 11/22/2015.
 *
 */
(function (controllers) {
    controllers.controller("mapsCtrl", ["apiService","$scope", "uiGmapGoogleMapApi", "uiGmapIsReady", '$location',
        function (apiService, $scope, uiGmapGoogleMapApi, uiGmapIsReady, $location) {

            var vm = this;
            // static start position
            var currentMapCenter = {latitude: 8.536426, longitude: -11.896692};
            var currentMapZoom = 8;
            $scope.facilityMarkersReady = false;

            $scope.legallyCreateCustomMarker = false;
            $scope.mapClicked = false;
            $scope.customMarker = { idKey: "001", coords: {}};

            $scope.oneAtATime = true;
            $scope.level = 0;

            $scope.editUnit = {};

            // search function. uses getFacilities from the service.
            $scope.search = function() {
                apiService.getFacilities($scope.searchName, $scope.level).get(function(result) {
                    $scope.facilities = result.organisationUnits;


                    // Markers for results and whipes map
                    $scope.unitMarkers = [];
                    $scope.facilityMarkersReady = false;
                    // Polygons for results
                    $scope.unitPolygons = [];

                    // apply polygons
                    if($scope.level == 2 || $scope.level == 3) {
                        polygonsOnMap();
                    }
                    // applies markers for facility level only.
                    else if($scope.level == 4) {
                        markersOnMap();
                    }
                });
            };

            // used for getting the level 3 facilities to create the parent dropdown menu in create new
            $scope.searchLevel3 = function() {
                apiService.getFacilities("", 3).get(function(result) {
                   $scope.chiefdoms = result.organisationUnits;
                });
            };

            // sets the map
            init();
            function init() {
                var setMainMap = function() {
                    $scope.map = {
                        center: currentMapCenter,
                        zoom: currentMapZoom,
                        events: {
                            click: function (mapObject, eventName, originalEventArgs) {
                                // legallyCreateCustomMarker can disable the possibility to interact with the map.
                                if ($scope.legallyCreateCustomMarker) {
                                    // get the marker from where the user clicked and save it
                                    var e = originalEventArgs[0];
                                    $scope.customMarker.coords = {latitude: e.latLng.lat(), longitude: e.latLng.lng()};
                                    $scope.editUnit.latitude = e.latLng.lat();
                                    $scope.editUnit.longitude = e.latLng.lng();
                                    $scope.mapClicked = true;

                                    // Her henter vi data fra server - gjør at kartet lastes med den nye markeren
                                    apiService.makeMapLoad().get();
                                }
                            }
                        }
                    };
                };
                setMainMap();
            } // end of init()

            // plots facility markers on the map
            function markersOnMap(){
                if ($scope.level != 4) return; // sanity check

                function pushMarkersToMap(id, facility){
                    facility.viewCoords = {};

                    if(!facility.coordinates){
                        return;
                    }

                    var geoData = JSON.parse(facility.coordinates);
                    facility.viewCoords = {latitude: geoData[1], longitude: geoData[0]};

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
                // Goes through a facility/district and adds its polygons to one
                // array, and then pushes that array to the outer array which is called
                // unitPolygons
                function pushPolygonsToMap(id, facility){
                    // Local array with local polygons
                    var coordinates = [];

                    // If there are noe coordinates, then just return
                    if(!facility.coordinates){
                        return;
                    }

                    // Parses the json and puts it in an 2Darray geoData
                    var geoData = JSON.parse(facility.coordinates)[0][0];

                    // Add each coordinate to the coordinates-array
                    for (var i = 0; i < geoData.length; i++){
                        var x = geoData[i][0];
                        var y = geoData[i][1];
                        coordinates.push({latitude: y, longitude: x});
                    }

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

                        //Her må kartet lastes på nytt.
                        init();

                        // Her henter vi data fra server - gjør at kartet lastes med den nye markeren
                        apiService.makeMapLoad().get();
                    });
                }
                /* else {
                    We are not allowed to track location
                } */
            };



            var clearCustomMarker = function(){
                $scope.customMarker = { idKey: "001"};
                $scope.mapClicked = false;
            };

            // Save button from website
            // sets the names that where written on the different
            // input forms, then does a save-function to push to
            // database
            $scope.saveNewUnit = function(){
                // check for manual long/lat input
                var newUnitLatitude = $scope.newUnit.latitude;
                if (!newUnitLatitude && $scope.customMarker.coords.latitude) newUnitLatitude = $scope.customMarker.coords.latitude.toString();
                var newUnitLongitude = $scope.newUnit.longitude;
                if (!newUnitLongitude && $scope.customMarker.coords.longitude) newUnitLongitude = $scope.customMarker.coords.longitude.toString();

                var unit = {
                    name: $scope.newUnit.name,
                    shortName: $scope.newUnit.shortName,
                    description: $scope.newUnit.description,
                    code: $scope.newUnit.code,
                    coordinates: "["+newUnitLongitude+", "+newUnitLatitude+"]",
                    level: parseInt($scope.newUnit.level),
                    openingDate: new Date(),
                    parent: { id: $scope.newUnit.parentId.id }
                };
                apiService.createUnit().save(unit, function(){
                    $location.path('/');
                });

                // Clearing the input fields, except for long/lat so itæs not made dirty for auto update from the map.
                $scope.newUnitForm.$setPristine();
                $scope.newUnit.level = {};
                $scope.newUnit.parentId = "";
                $scope.newUnit.name = "";
                $scope.newUnit.shortName = "";
                $scope.newUnit.description = "";
                $scope.newUnit.code = "";
                clearCustomMarker();
            };

            // much the same as saving a new unit.
            $scope.updateUnit = function(facility) {
                if(!facility.viewCoords) facility.viewCoords = {};
                if($scope.editUnit.latitude) facility.viewCoords.latitude = $scope.editUnit.latitude;
                else if($scope.customMarker.latitude) facility.viewCoords.latitude = $scope.customMarker.latitude;
                if($scope.editUnit.longitude) facility.viewCoords.longitude = $scope.editUnit.longitude;
                else if($scope.customMarker.longitude) facility.viewCoords.longitude = $scope.customMarker.longitude;

                facility.coordinates = "["+facility.viewCoords.longitude+", "+facility.viewCoords.latitude+"]";
                console.log("updateUnit :\n\tid: " + facility.id + "\n\tname: " + facility.name + "\n\tshortName: " + facility.shortName + "\n\tcoords: " + facility.coordinates);
                console.log(facility);
                apiService.updateUnit(facility.id).update(facility, function(){
                    $location.path('/');
                });
            };
        }]);

})(angular.module('mainControllers'));
