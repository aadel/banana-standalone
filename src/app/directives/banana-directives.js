"use strict";

define(['angular', 'config'], (angular, config) => {
    angular.module('kibana.directives')
        .directive('appVersion', () => {
            return function(scope, elm/*, attrs*/) {
                elm.text(config.REV);
            };
        });
});