"use strict";

define([
  'angular',
  'kbn'
],
function (angular) {

  angular
    .module('kibana.directives')
    .directive('tip', function($compile) {
      return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
          var _t = '';
          if (!attrs['placement']) {
            _t = '<i class="icon-'+(attrs.icon||'question-sign')+'" bs-tooltip data-title="' +
              elem.text() + '"></i>';
          } else {
            _t = '<i class="icon-'+(attrs.icon||'question-sign')+'" bs-tooltip data-title="' +
              elem.text() + '" data-placement="'+attrs['placement'] + '"></i>';
          }
          
          elem.replaceWith($compile(angular.element(_t))(scope));
        }
      };
    });
});