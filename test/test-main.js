var allTestFiles = [];

var TEST_REGEXP = /test\/spec\/filters\.js$/;

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
    'underscore-src':      'vendor/underscore',
    'jquery':              'vendor/jquery/jquery-1.12.1',
    'showdown':            'vendor/showdown',
    'underscore':          'app/components/underscore.extended',
    'banana-filters':      'app/filters/all'
  },
  shim: {
    angular:                { exports: 'angular' },
    'angular-mocks':        { deps: ['angular'] },
    'underscore':           { exports: '_' },
    'banana-filters':       { deps: ['angular', 'jquery', 'underscore', 'showdown']}
  },

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});