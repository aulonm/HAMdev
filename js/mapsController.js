/**
 * Created by aulon on 11/22/2015.
 */
(function (controllers) {


    controllers.controller("mapsCtrl", ['$scope', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'api', '$location',
        function ($scope, uiGmapGoogleMapApi, uiGmapIsReady, api, $location) {
            // Do stuff with your $scope.
            // Note: Some of the directives require at least something to be defined originally!
            // e.g. $scope.markers = []

            // uiGmapGoogleMapApi is a promise.
            // The "then" callback function provides the google.maps object.
            uiGmapGoogleMapApi.then(function (maps) {
                var baseOptions = {
                    'maxZoom': 15,
                    'minZoom': 4,
                    'backgroundColor': '#b0d1d4',
                    'panControl': false,
                    'zoomControl': true,
                    'draggable': true,
                    'zoomControlOptions': {
                        'position': 'RIGHT_TOP',
                        'style`': 'SMALL'
                    }
                };
                $scope.map = {
                    center: {latitude: 45, longitude: -74.5},
                    options: baseOptions,
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
                                /* We are not allowed to track location */
                            }
                        }
                    },
                    /* Dummy data for showing Markers and Polygons */
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
            });
        }]);

})(angular.module('mainControllers'));