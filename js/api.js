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

        return {
            // Angular $resource documentation
            //https://docs.angularjs.org/api/ngResource/service/$resource

            // call to DHIS2 API to get organisation units
            getFacilities: function(name, level){
                var filters = ""; // used to apply filters to the search, from DHIS api 1.7
                // check for empty name, apply filter if not empty. ilike check stringmatch anywhere in string case insensitive
                if(name != "" && name != null) {
                    filters += "&filter=name:ilike:" + name;
                }
                if(level != 0) { // add filter for level if present
                    filters += "&filter=level:eq:" + level;
                }
                return $resource(
                    $rootScope.API + '/api/organisationUnits?paging=false:filter', {
                        filter: filters,
                        fields: "id, name, coordinates, level, children, parent, shortName, description, code, openingDate"
                    }, {
                        'query': {
                            isArray: false
                        }
                    }
                );
            },

            // call to DHIS2 API to create new facility
            createUnit: function(){
               return $resource(
                   $rootScope.API + '/api/organisationUnits/', {},{}
               );
            },

            // call to DHIS2 API to update a given facility
            updateUnit: function(id){
                return $resource(
                    $rootScope.API + '/api/organisationUnits/' + id, {},
                    {
                        'update': {
                            method: 'PUT'
                        }
                    }
                );
            },

            makeMapLoad: function(){
                return $resource(
                    $rootScope.API + '/api/organisationUnits/', {},{}
                );
            }
        }
    });


})(angular.module('mainServices'));
