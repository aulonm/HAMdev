/**
 * Created by aulon on 15.11.15.
 */

(function(){
    'use strict';

    /* Lager main moduler, og saa sier vi at de mindre modulene skal ta ting fra disse,
    eller bygges videre paa disse*/
    angular.module('mainServices', ['ngResource']);
    angular.module('mainControllers', ['mainServices']);

    /* Define modules */
    var app  = angular.module('main', ['ngRoute', 'mainControllers']);



    /* Her redirecter den til den sida som vi vil skal vises, fyller opp index.html fila */
    app.config(['$routeProvider',
        function($routeProvider){
            $routeProvider.when('',{ // Hvor prOver du aa faa tak i stuff
                templateUrl: 'URL' // Hvor ligger urlen
                /* controller: */
            }).otherwise({
                redirectTo: 'URL' // Hvis ikke, redirect her
            });
        }
    ]);

})(angular);