"use strict";

define([
  'angular'
],
function (angular) {

  angular
    .module('kibana.directives')
    .directive('kibanaPanel', function($compile) {
      var container = '<div class="panel panel-default"></div>';

      return {
        restrict: 'E',
        link: function($scope, elem, attr) {
          // once we have the template, scan it for controllers and
          // load the module.js if we have any

          // compile the module and uncloack. We're done
          function loadModule($module) {
            $module.appendTo(elem);
            elem.wrap(container);
            /* jshint indent:false */
            $compile(elem.contents())($scope);
            // inject panel-body !fragile!
            if ($(elem[0].querySelector('.panel-heading')).siblings().length === 0) {
              $('<div class="panel-body"></div>')
                .insertAfter(elem[0].querySelector('.panel-heading'));
            } else {
              $(elem[0].querySelector('.panel-heading')).siblings()
                .wrapAll('<div class="panel-body"></div>');
            }
            $(elem[0].querySelector('.panel-body'))
              .append($(elem[0].querySelector('[ng-controller]')).contents()
                .filter(function () {return this.nodeType === 8;}));
            elem.removeClass("ng-cloak");
          }

          $scope.$watch(attr.type, function (name) {
            elem.addClass("ng-cloak");
            // load the panels module file, then render it in the dom.
            $scope.require([
              'jquery',
              'text!panels/'+name+'/module.html',
              'css!panels/' + name + '/module.css'
            ], function ($, moduleTemplate) {
              var $module = $(moduleTemplate);
              // top level controllers
              var $controllers = $module.filter('ngcontroller, [ng-controller], .ng-controller');
              // add child controllers
              $controllers = $controllers.add($module.find('ngcontroller, [ng-controller], .ng-controller'));

              if ($controllers.length) {
                $scope.require(['text!partials/panelHeader.html'], editorTemplate => {
                  $controllers.first().prepend(editorTemplate);
                  $scope.require([
                    'panels/'+name+'/module'
                  ], function() {
                    loadModule($module);
                  });
                });
              } else {
                loadModule($module);
              }
            });
          });
        }
      };
    });

});
