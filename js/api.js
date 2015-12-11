/**
 * Created by aulon on 15.11.15.
 */
/* Angular module to get all the information from the web api */

(function(services){
    'use strict';


    services.factory("apiService", function($q, $resource, $http, $rootScope){
        // Get requests osv
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "manifest.webapp", false);
        xhttp.send(null);

        var response = JSON.parse(xhttp.responseText);
        $rootScope.API = response.activities.dhis.href; //need to doublecheck this

        // The database
        // https://play.dhis2.org/demo/api/organisationUnits
        // List of organisation units like this:
        //<organisationUnit lastUpdated="2014-11-25T09:37:54.322+0000" code="OU_651071" created="2012-02-17T15:54:39.987+0000" name="Adonkia CHP" id="Rp268JB6Ne4" href="https://play.dhis2.org/demo/api/organisationUnits/Rp268JB6Ne4"/>
        //Inside each unit, the information is like this:
        //<organisationUnit xmlns="http://dhis2.org/schema/dxf/2.0" code="OU_651071" uuid="bf07fb5b-a1cf-4a83-b3ec-9cc42854adcf" lastUpdated="2014-11-25T09:37:54.322+0000" href="https://play.dhis2.org/demo/api/organisationUnits/Rp268JB6Ne4" id="Rp268JB6Ne4" level="4" created="2012-02-17T15:54:39.987+0000" name="Adonkia CHP" shortName="Adonkia CHP">
        // name: "Adonkia CHP"
        // shortname: "Adonkia CHP"
        // level="4"
        // parent: <parent id="qtr8GGlm4gg" name="Rural Western Area"
        // two children


        // Level one organisation:
        //https://play.dhis2.org/demo/api/organisationUnits/ImspTQPwCqd
        // level two organisation: Fuckton of coordinates (POLYGONS!)
        // https://play.dhis2.org/demo/api/organisationUnits/eIQbndfxQMb
        // level three organisation: Has many coordinates (POLYGONS)
        // https://play.dhis2.org/demo/api/organisationUnits/l0ccv2yzfF3
        // level four organisation:
        // https://play.dhis2.org/demo/api/organisationUnits/OY7mYDATra3
        //

        return {

            // HOW THIS SHIT WORKS!
            //https://docs.angularjs.org/api/ngResource/service/$resource

            // gets facilities
            getFacilities: function(name, level){
                var filters = ""; // used to apply filters to the search, from DHIS api 1.7
                if(name != "") {
                    filters += "&filter=name:ilike:" + name;
                }
                if(level != 0) {
                    filters += "&filter=level:eq:" + level.toString();
                }

                return $resource(
                    $rootScope.API + '/api/metadata?assumeTrue=false&organisationUnits=true' + filters, {
                        fields: "id, name, coordinates, level, children, parent, shortName, description, code"
                    }, {
                        'query': {
                            isArray: false
                        }
                    }
                );
            },

            createUnit: function(){
               return $resource(
                   $rootScope.API + '/api/organisationUnits/', {},{}
               );
            },

            makeMapLoad: function(){
                return $resource(
                    $rootScope.API + '/api/organisationUnits/', {},{}
                );
            }

            // Different functions
            // getting organization units
            // saving units
            // etc.
            // I think this is a good way of doing it
            // Doesnt actually save, just returns json files. The controller saves stuff to variables and arrays
            // and shit
        }
    });


})(angular.module('mainServices'));