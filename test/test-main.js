var allTestFiles = [];

var TEST_REGEXP = /test\/spec\/.+Spec\.js$/;

for (var file in window.__karma__.files) {
  if (TEST_REGEXP.test(file))
    allTestFiles.push(file);
}

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base/src',

  paths: {
    angular:               'vendor/angular/angular.min',
    'angular-mocks':       'vendor/angular/angular-mocks',
    'angular-route':       'vendor/angular/angular-route.min',
    'angular-dragdrop':    'vendor/angular/angular-dragdrop',
    'angular-strap':       'vendor/angular/angular-strap',
    'angular-sanitize':    'vendor/angular/angular-sanitize.min',
    'underscore-src':      'vendor/underscore',
    'jquery':              'vendor/jquery/jquery-1.12.1',
    'extend-jquery':       'app/components/extend-jquery',
    'showdown':            'vendor/showdown',
    'underscore':          'app/components/underscore.extended',
    'bootstrap':           'vendor/bootstrap/bootstrap',

    app:                   'app/app',
    kbn:                   'app/components/kbn',
    solrjs:                'vendor/solrjs/solr',
    elasticjs:             'vendor/elasticjs/elastic-angular-client',
    filesaver:             'vendor/filesaver',
    css:                   'vendor/require/css',
    text:                  'vendor/require/text',
    moment:                'vendor/moment',
    modernizr:             'vendor/modernizr-2.6.1',
    'banana-filters':      'app/filters/all',

    addPanel:              'app/directives/addPanel',
    arrayJoin:             'app/directives/arrayJoin',
    dashUpload:            'app/directives/dashUpload',
    kibanaPanel:           'app/directives/kibanaPanel',
    ngBlur:                'app/directives/ngBlur',
    ngModelOnBlur:         'app/directives/ngModelOnBlur',
    confirmClick:          'app/directives/confirmClick',
    tip:                   'app/directives/tip',
    'banana-directives':   'app/directives/banana-directives',

    alertSrv:              'app/services/alertSrv',
    dashboard:             'app/services/dashboard',
    fields:                'app/services/fields',
    filterSrv:             'app/services/filterSrv',
    kbnIndex:              'app/services/kbnIndex',
    querySrv:              'app/services/querySrv',
    timer:                 'app/services/timer',
    panelMove:             'app/services/panelMove',
    solrSrv:               'app/services/solrSrv',
    lucidworksSrv:         'app/services/lucidworksSrv',
    
    dash:                  'app/controllers/dash',
    dashLoader:            'app/controllers/dashLoader',
    row:                   'app/controllers/row',

    'all-controllers':     'app/controllers/all',
    'all-directives':      'app/directives/all',
    'all-services':        'app/services/all',
    'all-filters':         'app/filters/all',

    'settings':            'app/components/settings',
    'config':              'config'
  },
  shim: {
    angular:                { exports: 'angular' },
    'angular-mocks':        { deps: ['angular'] },
    jquery:                 { exports: '$'},
    'underscore':           { exports: '_' },
    'banana-filters':       { deps: ['angular', 'jquery', 'underscore', 'showdown']}
  },

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});