"use strict";

/*
  ## D3 Cluster with Tooltip Integrated with Banana.

  ### Parameters
  * algorithm :: result clustering algorithm.
*/
define([
    'angular',
    'app',
    'underscore',
    'jquery',
    'kbn',
    'd3',
    './lib/d3-voronoi-map'
  ],
  function(angular, app, _, $, kbn, d3, voronoiMapSimulation) {

    var module = angular.module('kibana.panels.resultCluster', []);
    app.useModule(module);

    module.controller('resultCluster', function($scope, querySrv, dashboard, filterSrv) {
      $scope.panelMeta = {
        modals: [{
          description: "Inspect",
          icon: "icon-info-sign",
          partial: "app/partials/inspector.html",
          show: $scope.panel.spyable
        }],
        editorTabs: [{
          title: 'Queries',
          src: 'app/partials/querySelect.html'
        }],
        status: "Beta",
        description: "Display result clustering with Tooltip."
      };

      // Set and populate defaults
      var _d = {
        queries: {
          mode: 'all',
          query: '*:*',
          custom: ''
        },
        field: '',
        rows: 100,
        spyable: true,
        show_queries: true,
        error: '',
      };
      _.defaults($scope.panel, _d);

      $scope.init = function() {
        $scope.hits = 0;
        $scope.$on('refresh', function() {
          $scope.get_data();
        });
        $scope.get_data();
      };

      $scope.get_data = function() {
      	// Make sure we have everything for the request to complete
        if (dashboard.indices.length === 0) {
          return;
        }
        delete $scope.panel.error;
        $scope.panelMeta.loading = true;
        var request, results;

        $scope.sjs.client.server(dashboard.current.solr.server + dashboard.current.solr.core_name);

        request = $scope.sjs.Request().indices(dashboard.indices);
        $scope.panel.queries.ids = querySrv.idsByMode($scope.panel.queries);

        // Populate the inspector panel
        $scope.inspector = angular.toJson(JSON.parse(request.toString()), true);

        // Build Solr query
        var fq = '';
        if (filterSrv.getSolrFq() && filterSrv.getSolrFq() !== '') {
          fq = '&' + filterSrv.getSolrFq();
        }
        var wt_json = '&wt=json';
        var rows_limit = '&rows=' + $scope.panel.rows;
        var title_field = '&carrot.title=' + $scope.panel.title_field;
        var snippet_field = '&carrot.snippet=' + $scope.panel.content_field;
        var clustering_engine = $scope.panel.algorithm ? '&clustering.engine=' + $scope.panel.algorithm : '';

        // Set the panel's query
        $scope.panel.queries.query = querySrv.getOPQuery() + clustering_engine 
          + title_field + snippet_field + wt_json + rows_limit + fq;

        // Set the additional custom query
        if ($scope.panel.queries.custom) {
          request = request.setQuery($scope.panel.queries.query + $scope.panel.queries.custom);
        } else {
          request = request.setQuery($scope.panel.queries.query);
        }

        results = request.doClustering();

        // Populate scope when we have results
        results.then(function(results) {
          // Check for error and abort if found
          if (!(_.isUndefined(results.error))) {
            $scope.panel.error = $scope.parse_error(results.error.msg);
            return;
          }

          $scope.data = {clusters: []};
          _.each(results.clusters, (c, i) => {
            $scope.data.clusters.push({id: i, composition: c.labels[0],
              weight: c.score ? c.score * c.docs.length : c.docs.length,
              docs: c.docs});
          });
          $scope.data.docs = results.response.docs;
          $scope.panelMeta.loading = false;
          $scope.$emit('render');
        });
      };

      $scope.build_search = function(word) {
        if(word) {
          filterSrv.set({type:'terms', field:$scope.panel.content_field, value:word, mandate:'must'});
        } else {
          return;
        }
        dashboard.refresh();
      };

      $scope.set_refresh = function(state) {
        $scope.refresh = state;
        // if 'count' mode is selected, set decimal_points to zero automatically.
        if ($scope.panel.mode === 'count') {
          $scope.panel.decimal_points = 0;
        }
      };

      $scope.close_edit = function() {
        if ($scope.refresh) {
          $scope.get_data();
        }
        $scope.refresh = false;
        $scope.$emit('render');
      };
    });

    module.directive('resultCluster', function() {
      return {
        restrict: 'A',
        link: function(scope, element) {
          // Receive render events
          scope.$on('render', function() {
            render_panel();
          });

          // Re-render if the window is resized
          angular.element(window).bind('resize', function() {
            render_panel();
          });
          // Function for rendering panel
          function render_panel() {
            element.html("");
            var el = element[0];
            var parent_width = element.parent().width(),
            height = parseInt(scope.row.height),
            padding = 50;
            var margin = {
              top: 20,
              right: 20,
              bottom: 40,
              left: 60
            },
            width = parent_width - margin.left - margin.right;
            
            height = height - margin.top - margin.bottom;
            
            var formatPercent = d3.format(".0");
            
            var highlighterClusterId = d => "cluster-" + d.id;
            var highlight = (clusterId, highlight) => {
              return () => d3.selectAll(".cluster-" + clusterId).classed("highlight", highlight);
            };
            function attachMouseListener (data) {
              data.forEach(d => {
                d3.selectAll(".cluster-" + d.id)
                  .on("mouseenter", highlight(d.id, true))
                  .on("mouseleave", highlight(d.id, false))
                  .on("click", () => scope.build_search(d.composition));
              });
            }
            var myColor = d3.scaleSequential().domain([1, 100]).interpolator(d3.interpolateWarm);
            
            var simulation = voronoiMapSimulation.voronoiMapSimulation(scope.data.clusters)
              .weight(d => d.weight)
              .clip([[0,0], [0,height], [width, height], [width,0]])
              .stop();
            
            var state = simulation.state();
            
            while (!state.ended) {
              simulation.tick();
              state = simulation.state();
            }
              
            var polygons = state.polygons;
            
            var svg = d3.select(el).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("viewBox", "0 0 " + parent_width + " " + (height + margin.top + margin.bottom))
            .attr("preserveAspectRatio", "xMidYMid")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
            svg.selectAll('.cell').data(polygons)
            .enter()
            .append('path')
            .attr('d', d => { return "M" + d.join(",") + "z"; })
            .style("stroke", "black")
            .style('fill', d => { return myColor(d.site.x / width * 100); });
            
            svg.selectAll('text').data(polygons)
            .enter()
            .append('text')
            .text(d => d.site.originalObject.data.originalData.composition)
            .attr("transform", d => "translate(" + [d.site.x, d.site.y] + ")")
            .attr("text-anchor", "middle");

            svg.selectAll('.highlighters').data(polygons)
            .enter()
            .append('path')
            .attr('d', d => { return "M" + d.join(",") + "z"; })
            .attr("class", d => highlighterClusterId(d.site.originalObject.data.originalData))
            .classed('highlighter', true);
            
            attachMouseListener(scope.data.clusters);
          }
        }
      };
    });
  });
