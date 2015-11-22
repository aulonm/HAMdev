/**
 * Created by aulon on 11/22/2015.
 */
(function(controllers){
    'use strict';

    controllers.controller('mapsController', ['$scope', 'GoogleMapApi', function(GoogleMapApi){
        $scope.map = {
            center: {
                latitude: 45,
                longitude: -73
            },
            zoom: 8 };
    }]);

})(angular.module('mainControllers'));