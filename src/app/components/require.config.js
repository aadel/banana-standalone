/**
 * Bootstrap require with the needed config, then load the app.js module.
 */
require.config({
  baseUrl: 'app',
  waitSeconds: 0,
  // urlArgs: 'r=@REV@',
  paths: {
    config:                   '../config',
    settings:                 'components/settings',
    kbn:                      'components/kbn',

    css:                      '../vendor/require/css',
    text:                     '../vendor/require/text',
    moment:                   '../vendor/moment',
    filesaver:                '../vendor/filesaver',

    angular:                  '../vendor/angular/angular',
    'angular-dragdrop':       '../vendor/angular/angular-dragdrop',
    'angular-strap':          '../vendor/angular/angular-strap',
    'angular-sanitize':       '../vendor/angular/angular-sanitize',
    'angular-route':          '../vendor/angular/angular-route',
    timepicker:               '../vendor/angular/timepicker',
    datepicker:               '../vendor/angular/datepicker',

    underscore:               'components/underscore.extended',
    'underscore-src':         '../vendor/underscore',
    bootstrap:                '../vendor/bootstrap/bootstrap',

    jquery:                   '../vendor/jquery/jquery-1.12.1',
    'jquery-ui':              '../vendor/jquery/jquery-ui-1.10.3',

    'extend-jquery':          'components/extend-jquery',

    'jquery.flot':            '../vendor/jquery/jquery.flot',
    'jquery.flot.pie':        '../vendor/jquery/jquery.flot.pie',
    'jquery.flot.selection':  '../vendor/jquery/jquery.flot.selection',
    'jquery.flot.stack':      '../vendor/jquery/jquery.flot.stack',
    'jquery.flot.stackpercent':'../vendor/jquery/jquery.flot.stackpercent',
    'jquery.flot.time':       '../vendor/jquery/jquery.flot.time',
    'jquery.flot.axislabels': '../vendor/jquery/jquery.flot.axislabels',
    'showdown':               '../vendor/showdown',

    modernizr:                '../vendor/modernizr-2.6.1',
    elasticjs:                '../vendor/elasticjs/elastic-angular-client',
    solrjs:                   '../vendor/solrjs/solr-angular-client',
    'd3':                     '../vendor/d3',
    'd3-sankey':              '../vendor/d3-sankey',
    'd3-array':               '../vendor/d3-array',
    'd3-collection':          '../vendor/d3-collection',
    'd3-shape':               '../vendor/d3-shape',
    'd3-path':                '../vendor/d3-path',
    'd3-polygon':             '../vendor/d3-polygon',
    'd3-weighted-voronoi':    '../vendor/d3-weighted-voronoi',
    'd3-force':               '../vendor/d3-force',
    'd3-quadtree':            '../vendor/d3-quadtree',
    'd3-dispatch':            '../vendor/d3-dispatch',
    'd3-timer':               '../vendor/d3-timer',
    'd3-scale-chromatic':     '../vendor/d3-scale-chromatic'
  },
  shim: {
    underscore: {
      exports: '_'
    },

    angular: {
      deps: ['jquery'],
      exports: 'angular'
    },

    bootstrap: {
      deps: ['jquery']
    },

    modernizr: {
      exports: 'Modernizr'
    },

    jquery: {
      exports: 'jQuery'
    },

    // simple dependency declaration
    'jquery-ui':            ['jquery'],
    'jquery.flot':          ['jquery'],
    'jquery.flot.pie':      ['jquery', 'jquery.flot'],
    'jquery.flot.selection':['jquery', 'jquery.flot'],
    'jquery.flot.stack':    ['jquery', 'jquery.flot'],
    'jquery.flot.stackpercent':['jquery', 'jquery.flot'],
    'jquery.flot.time':        ['jquery', 'jquery.flot'],
    'jquery.flot.axislabels':  ['jquery', 'jquery.flot'],

    'angular-sanitize':     ['angular'],
    'angular-cookies':      ['angular'],
    'angular-dragdrop':     ['jquery','jquery-ui','angular'],
    'angular-loader':       ['angular'],
    'angular-mocks':        ['angular'],
    'angular-resource':     ['angular'],
    'angular-route':        ['angular'],
    'angular-touch':        ['angular'],
    'angular-route':        ['angular'],

    'angular-strap':        ['angular', 'bootstrap', 'timepicker', 'datepicker'],

    timepicker:             ['jquery', 'bootstrap'],
    datepicker:             ['jquery', 'bootstrap'],

    elasticjs:              ['angular', '../vendor/elasticjs/elastic'],
    solrjs:                 ['angular', '../vendor/solrjs/solr']
  }
});
