module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'requirejs'],


    // list of files / patterns to load in the browser
    files: [
      'test/test-main.js',
      {pattern: 'src/vendor/*.js', included: false},
      {pattern: 'src/vendor/jquery/jquery-ui-1.10.3.js', included: false},
      {pattern: 'src/vendor/solrjs/*.js', included: false},
      {pattern: 'src/vendor/bootstrap/bootstrap.js', included: false},
      {pattern: 'src/vendor/angular/*.js', included: false},
      {pattern: 'src/vendor/elasticjs/*.js', included: false},
      {pattern: 'src/vendor/jquery/jquery-1.12.1.js', included: false},
      {pattern: 'src/app/components/extend-jquery.js', included: false},
      {pattern: 'src/app/components/*.js', included: false},
      {pattern: 'src/app/app.js', included: false},
      {pattern: 'src/app/controllers/*.js', included: false},
      {pattern: 'src/app/directives/*.js', included: false},
      {pattern: 'src/app/filters/*.js', included: false},
      {pattern: 'src/app/services/*.js', included: false},
      {pattern: 'src/config.js', included: false},
      {pattern: 'src/app/panels/table/module.js', included: false},
      {pattern: 'src/app/partials/*.html', included: true},
      {pattern: 'src/app/dashboards/*.json', included: false},

      // {pattern: 'bower_components/**/*.js', included: false},

      {pattern: 'test/**/*Spec.js', included: false}
      // {pattern: 'test/unit/tableSpec.js', included: false}
    ],


    // list of files to exclude
    exclude: [
      'src/app/components/require.config.js'
    ],

    proxies:  {
      '/solr/': 'http://localhost:8983/solr/',
      '/app/': '/base/src/app/'
    },
    
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
