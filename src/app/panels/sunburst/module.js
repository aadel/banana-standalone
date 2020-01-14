/**
 * Sunburst panel
 */
define([
    'angular',
    'app',
    'underscore',
    'jquery',
    'd3'
], function (angular, app, _, $, d3) {
    'use strict';

    var module = angular.module('kibana.panels.sunburst', []);
    app.useModule(module);

    module.controller('sunburst', function ($scope, dashboard, querySrv, filterSrv) {
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
            status: "Experimental",
            description: "This panel generates a sunburst graphic based on solr Facet Pivots output. "
        };

        // default values
        var _d = {
            queries: {
                mode: 'all',
                ids: [],
                query: '*:*',
                custom: ''
            },
            facet_limit: 1000, // maximum number of rows returned from Solr
            spyable: true,
            show_queries: true
        };
        _.defaults($scope.panel, _d);

        $scope.init = function () {
            $scope.$on('refresh', function () {
                $scope.get_data();
            });
            $scope.get_data();
        };

        $scope.parse_facet_pivot = function (data) {
            var out = {'name': 'root', 'children': []};
            for (var ob in data) {
                out.children.push($scope.parse_item(data[ob]));
            }
            return out;
        };

        $scope.parse_item = function (doc) {
            var t = {'name': doc.value, 'size': doc.count, 'children': []};
            for (var piv in doc.pivot) {
                t.children.push($scope.parse_item(doc.pivot[piv]));
            }
            return t;
        };

        $scope.get_data = function () {
            // Show progress by displaying a spinning wheel icon on panel
            $scope.panelMeta.loading = true;
            delete $scope.panel.error;

            var request, results;
            // Set Solr server
            $scope.sjs.client.server(dashboard.current.solr.server + dashboard.current.solr.core_name);
            // -------------------- TODO: REMOVE ALL ELASTIC SEARCH AFTER FIXING SOLRJS --------------
            $scope.panel.queries.ids = querySrv.idsByMode($scope.panel.queries);
            // This could probably be changed to a BoolFilter
            var boolQuery = $scope.sjs.BoolQuery();
            _.each($scope.panel.queries.ids, function (id) {
                boolQuery = boolQuery.should(querySrv.getEjsObj(id));
            });
            request = $scope.sjs.Request().indices(dashboard.indices);
            request = request.query(
                $scope.sjs.FilteredQuery(
                    boolQuery,
                    filterSrv.getBoolFilter(filterSrv.ids)
                )); // Set the size of query result
            $scope.populate_modal(request);
            // --------------------- END OF ELASTIC SEARCH PART ---------------------------------------

            // Construct Solr query
            var fq = '';
            if (filterSrv.getSolrFq()) {
                fq = '&' + filterSrv.getSolrFq();
            }
            var wt_json = '&wt=json';
            var rows = '&rows=0';
            var facet = '&facet=true';
            var facet_pivot = '&facet.pivot=' + $scope.panel.facet_pivot_strings.join().replace(/ /g, '');
            var facet_limits = '&facet.limit=' + $scope.panel.facet_limit;

            // Set the panel's query
            $scope.panel.queries.query = querySrv.getOPQuery() + fq + wt_json + facet + facet_pivot + facet_limits + rows;

            // Set the additional custom query
            if ($scope.panel.queries.custom != null) {
                request = request.setQuery($scope.panel.queries.query + $scope.panel.queries.custom);
            } else {
                request = request.setQuery($scope.panel.queries.query);
            }

            // Execute the search and get results
            results = request.doSearch();
            results.then(function (results) {
                $scope.data = $scope.parse_facet_pivot(results.facet_counts.facet_pivot[$scope.panel.facet_pivot_strings.join().replace(/ /g, '')]);
                $scope.render();
            });
        };

        $scope.dash = dashboard;

        $scope.set_refresh = function (state) {
            $scope.refresh = state;
        };

        $scope.close_edit = function () {
            if ($scope.refresh) {
                $scope.get_data();
            }
            $scope.refresh = false;
            $scope.$emit('render');
        };

        $scope.render = function () {
            $scope.$emit('render');
        };

        $scope.populate_modal = function (request) {
            $scope.inspector = angular.toJson(JSON.parse(request.toString()), true);
        };

        $scope.pad = function (n) {
            return (n < 10 ? '0' : '') + n;
        };

        $scope.set_filters = function (d) {
            for (var i = 0; i < d.length; i++) {
                filterSrv.set({
                    type: 'terms',
                    field: $scope.panel.facet_pivot_strings[i].replace(/ /g, ''),
                    mandate: 'must',
                    value: d[i]
                });
            }
            dashboard.refresh();
        };
    });

    module.directive('sunburst', function () {
        return {
            restrict: 'E',
            link: function (scope, element) {
                // Receive render events
                scope.$on('render', function () {
                    render_panel();
                });

                // Re-render if the window is resized
                angular.element(window).bind('resize', function () {
                    render_panel();
                });

                // Function for rendering panel
                function render_panel() {
                    function click(d) {
                        var parents = getAncestors(d);
                        var out = parents.map(function (a) {
                            return a.data.name;
                        });
                        scope.set_filters(out);
                    }

                    function stash(d) {
                        d.x0 = d.x0;
                        d.dx0 = d.x1 - d.x0;
                    }

                    function mouseover(d) {
                        var parents = getAncestors(d);
                        d3.selectAll("path")
                            .style("opacity", 0.3);
                        d3.selectAll("path")
                            .filter(function (node) {
                                return (parents.indexOf(node) >= 0);
                            })
                            .style("opacity", 1);
                        $tooltip
                            .html(d.data['name'] + ' (' + scope.dash.numberWithCommas(d.value) + ')')
                            .place_tt(d3.event.pageX, d3.event.pageY);
                    }

                    // Restore everything to full opacity when moving off the visualization.
                    function mouseleave() {
                        d3.selectAll("path")
                            .style("opacity", 1);
                        $tooltip.detach();
                    }

                    function getAncestors(node) {
                        var path = [];
                        var current = node;
                        while (current.parent) {
                            path.unshift(current);
                            current = current.parent;
                        }
                        return path;
                    }

                    element.html("");
                    var el = element[0];
                    var parent_width = element.parent().width(),
                        height = parseInt(scope.row.height);
                    var margin = {
                            top: 30,
                            right: 20,
                            bottom: 10,
                            left: 20
                        },
                        width = parent_width - margin.left - margin.right;

                    d3.selectAll("#sunbursttooltip").remove();
                    height = height - margin.top - margin.bottom;

                    var color = d3.scaleOrdinal(d3.schemeCategory10);
                    var radius = Math.min(width, height) / 6;
                    var svg = d3.select(el).append("svg")
                        .attr("viewBox", [0, 0, width, height])
                        .append("g")
                        .attr("transform", "translate(" + width / 2 + "," + height * 0.50 + ")");

                    var partition = data => {
                        const root = d3.hierarchy(scope.data)
                            .sum(d => d.size)
                            .sort((a, b) => b.value - a.value);
                        return d3.partition()
                            .size([2 * Math.PI, root.height + 1])
                            (root);
                    }

                    const root = partition(scope.data);
                    root.each(d => d.current = d);
                    
                    const arc = d3.arc()
                        .startAngle(d => d.x0)
                        .endAngle(d => d.x1)
                        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
                        .padRadius(radius * 1.5)
                        .innerRadius(d => d.y0 * radius)
                        .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))

                    function arcVisible(d) {
                        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
                    }
    
                    const path = svg.append("g")
                        .selectAll("path")
                        .data(root.descendants().slice(1))
                        .enter()
                        .append("path")
                            .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
                            .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
                            .attr("d", d => arc(d.current))
                            .each(stash)
                                .on("mouseover", mouseover)
                                .on("mouseleave", mouseleave)
                                .on("click", click);
                
                    const parent = svg.append("circle")
                        .datum(root)
                        .attr("r", radius)
                        .attr("fill", "none")
                        .attr("pointer-events", "all");

                    // svg.datum(scope.data).selectAll("path")
                    //     .data(partition().children)
                    //     .enter().append("path")
                    //     .attr("display", function (d) {
                    //         return d.depth ? null : "none";
                    //     }) // hide inner ring
                    //     .attr("d", arc)
                    //     .attr("bs-tooltip", function () {
                    //         return "'hello'";
                    //     })
                    //     .style("stroke", "#fff")
                    //     .style("fill", function (d) {
                    //         if (d.depth > 0) {
                    //             return color(d.data.name);
                    //         }
                    //     }).each(stash)
                    //     .on("mouseover", mouseover)
                    //     .on("mouseleave", mouseleave)
                    //     .on("click", click);

                    svg.selectAll("text.label").data(partition(scope.data));

                    // Hide the spinning wheel icon
                    scope.panelMeta.loading = false;
                    var $tooltip = $('<div id="sunbursttooltip">');
                }
            }
        };
    });
});
