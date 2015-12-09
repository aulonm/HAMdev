/**
 * Created by aulon on 11/22/2015.
 */
(function (controllers) {
    controllers.controller("mapsCtrl", ["apiService","$scope", "uiGmapGoogleMapApi", "uiGmapIsReady",
        function (apiService, $scope, uiGmapGoogleMapApi, uiGmapIsReady) {
            init();
            function init(){
                var setMainMap = function(){
                    $scope.map = {center: {latitude: 8.536426, longitude: -11.896692}, zoom: 8};
                };
                apiService.getFacilitiesOnLevel(2).get(function(result){
                    $scope.facilities = result.organisationUnits;
                    $scope.levelParent = $scope.facilities[0].parent;
                    console.log($scope.facilities[0]);
                    polygonsOnMap();
                    setMainMap();
                })
            }

            function polygonsOnMap(){
                $scope.unitPolygons = [];

                function pushPolygonsToMap(id, facility){
                    var coordinates = [];

                    if(!facility.coordinates){
                        return;
                    }

                    var geoData = JSON.parse(facility.coordinates)[0][0];

                    for (var i = 0; i < geoData.length; i++){
                        var x = geoData[i][0];
                        var y = geoData[i][1];
                        coordinates.push({latitude: y, longitude: x});
                    }

                    $scope.unitPolygons.push({
                        id: id,
                        path: coordinates,
                        stroke: {
                            color: '#6060FB',
                            weight: 3
                        },
                        editable: true,
                        draggable: false,
                        geodesic: false,
                        visible: true
                    });
                }
                for (var id in $scope.facilities){
                    var facility = $scope.facilities[id];
                    pushPolygonsToMap(id, facility);
                }
            }















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