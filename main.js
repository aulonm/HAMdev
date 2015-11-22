/**
 * Created by aulon on 15.11.15.
 */

(function(){
    'use strict';

    /* Lager main moduler, og saa sier vi at de mindre modulene skal ta ting fra disse,
    eller bygges videre paa disse*/
    angular.module('mainServices', ['ngResource']);

    angular.module('mainControllers', ['mainServices', 'uiGmapgoogle-maps']);

    /* Define modules */
    var app = angular.module('main', ['ngRoute', 'mainControllers']);

    /* controller for google maps */
    angular.controller('GoogleMapCtr', function($scope){
        $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
    });


})(angular);