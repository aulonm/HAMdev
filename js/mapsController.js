/**
 * Created by aulon on 11/22/2015.
 */
(function(controllers){

    controllers.controller("mapsCtrl", function($scope, uiGmapGoogleMapApi) {
        // Do stuff with your $scope.
        // Note: Some of the directives require at least something to be defined originally!
        // e.g. $scope.markers = []

        // uiGmapGoogleMapApi is a promise.
        // The "then" callback function provides the google.maps object.
        uiGmapGoogleMapApi.then(function(maps) {
            var baseOptions = {
                'maxZoom': 15,
                'minZoom': 4,
                'backgroundColor': '#b0d1d4',
                'panControl': false,
                'zoomControl': true,
                'draggable': true,
                'zoomControlOptions': {
                    'position': 'RIGHT_TOP',
                    'style': 'SMALL'
                }
            };
            $scope.map = { center: { latitude: 45, longitude: -73 }, options:baseOptions, zoom: 8 };
        });
    });




})(angular.module('mainControllers'));