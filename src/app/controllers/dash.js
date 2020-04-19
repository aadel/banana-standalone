"use strict";

define([
    'angular',
    'config',
    'underscore',
    'angular-strap',
    'all-services'
],
function (angular, config, _) {

    var module = angular.module('kibana.controllers');

    module.controller('DashCtrl', function ($scope, $route, ejsResource, sjsResource, fields, dashboard, alertSrv, panelMove) {
        $scope.dashControllerEditor = { index: 0 };

        $scope.editor_tabs = {
            general: {
                title: "General",
                src: 'app/partials/dasheditor/general.html'
            },
            rows: {
                title: "Rows",
                src: 'app/partials/dasheditor/rows.html'
            },
            controls: {
                title: "Controls",
                src: 'app/partials/dasheditor/controls.html'
            },
            solr: {
                title: "Solr",
                src: 'app/partials/dasheditor/solr.html'
            }
        };

        $scope.panelsTabs = {};

        // For moving stuff around the dashboard. Needs better names
        $scope.panelMove = panelMove;
        $scope.panelMoveDrop = panelMove.onDrop;
        $scope.panelMoveStart = panelMove.onStart;
        $scope.panelMoveStop = panelMove.onStop;
        $scope.panelMoveOver = panelMove.onOver;
        $scope.panelMoveOut = panelMove.onOut;

        $scope.init = function () {
            $scope.config = config;
            // Make underscore.js available to views
            $scope._ = _;
            $scope.dashboard = dashboard;
            $scope.dashAlerts = alertSrv;
            alertSrv.clearAll();

            // Provide a global list of all see fields
            $scope.fields = fields;
            $scope.reset_row();

            // Solr
            $scope.ejs = ejsResource(config.elasticsearch);
            $scope.sjs = sjsResource(config.solr + config.solr_core);
        };

        $scope.isPanel = function (obj) {
            if (!_.isNull(obj) && !_.isUndefined(obj) && !_.isUndefined(obj.type)) {
                return true;
            } else {
                return false;
            }
        };

        $scope.add_row = function (dash, row) {
            dash.rows.push(row);
        };

        $scope.reset_row = function () {
            $scope.row = {
                title: '',
                height: '150px',
                editable: true,
            };
        };

        $scope.row_style = function (row) {
            return {'min-height': row.collapse ? '5px' : row.height};
        };

        $scope.edit_path = function (type) {
            if (type) {
                return 'app/panels/' + type + '/editor.html';
            } else {
                return false;
            }
        };

        $scope.setEditorTabs = function (panelMeta, panel) {
            if (_.isUndefined($scope.panelsTabs[panel.type])) {
                let editorTabs = [{title: 'General', src: 'app/partials/panelgeneral.html'},
                {title: 'Panel', src: $scope.edit_path(panel.type)},
                {title: 'Info', src: 'app/partials/panelinfo.html'}];
                if (!_.isUndefined(panelMeta.editorTabs)) {
                    editorTabs = _.union(editorTabs, panelMeta.editorTabs, 'title');
                }
                $scope.panelsTabs[panel.type] = editorTabs;
            }
            return $scope.panelsTabs[panel.type];
        };

        // This is whoafully incomplete, but will do for now
        $scope.parse_error = function (data) {
            var _error = data.match("nested: (.*?);");
            return _.isNull(_error) ? data : _error[1];
        };

        $scope.init();
    });
});
