/**
 * Created by aulon on 15.11.15.
 */

(function(angular){
    'use strict';

    /* Lager main moduler, og saa sier vi at de mindre modulene skal ta ting fra disse,
    eller bygges videre paa disse*/
    angular.module('mainServices', ['ngResource']);

    angular.module('mainControllers', ['mainServices', 'uiGmapgoogle-maps', 'ui.bootstrap']);

    /* Define modules */
    var app = angular.module('main', ['mainControllers']);


    /* Enable CORS */
    app.config(['$httpProvider', function($httpProvider) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);

    app.config(['$httpProvider', function($http){
        $http.defaults.headers.common.Authorization = 'admin:district';
    }]);


    app.config(function(uiGmapGoogleMapApiProvider){
        uiGmapGoogleMapApiProvider.configure({
            v: '3.20',
            libraries: 'weather, geometry, visualization'
        });
    });

})(angular);