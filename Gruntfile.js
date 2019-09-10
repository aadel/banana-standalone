/* jshint node:true */

'use strict';
module.exports = function (grunt) {

  var config = {
    pkg: grunt.file.readJSON('package.json'),
    rootDir: '.',
    srcDir: 'src',
    routesDir: 'routes',
    viewsDir: 'views',    
    binDir: 'bin',
    destDir: 'dist',
    tempDir: 'tmp',
    meta: {
      // banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      //   '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      //   '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
      //   ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      //   ' Licensed <%= pkg.license %> */\n\n'
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= pkg.license %> */\n\n'
    },
    clean: {
      on_start: ['<%= destDir %>', '<%= tempDir %>'],
      temp: ['<%= tempDir %>'],
      build: {
        src: ['<%= tempDir %>/css/**/*.css', '!<%= tempDir %>/css/**/*.min.css']
      }      
    },
    less: {
      // this is the only task, other than copy, that runs on the src directory, since we don't really need
      // the less files in the dist. Everything else runs from on temp, and require copys everything
      // from temp -> dist
      dist:{
        expand: true,
        cwd:'<%= srcDir %>/vendor/bootstrap/less/',
        src: ['bootstrap.dark.less', 'bootstrap.light.less'],
        dest: '<%= tempDir %>/src/css/',
        ext: '.css'
      },
      // Compile in place when not building
      src:{
        options: {
          paths: ["<%= srcDir %>/vendor/bootstrap/less"],
          yuicompress:true
        },
        files: {
          "<%= srcDir %>/css/bootstrap.dark.css": "<%= srcDir %>/vendor/bootstrap/less/bootstrap.dark.less",
          "<%= srcDir %>/css/bootstrap.light.css": "<%= srcDir %>/vendor/bootstrap/less/bootstrap.light.less"
        }
      }
    },
    copy: {
      // copy source to temp, we will minify in place for the dist build
      everything_but_less_to_temp: {
        options: {
          mode: true,
        },
        cwd: '<%= rootDir %>',
        expand: true,
        src: [
          '<%= srcDir %>/**/*',
          '<%= routesDir %>/**/*',
          '<%= viewsDir %>/**/*',
          '<%= binDir %>/**/*',
          'app.js',
          'index.html',
          'config.json',
          '!**/*.less'
        ],
        dest: '<%= tempDir %>'
      },
      everything_to_dist: {
        options: {
          mode: true,
        },
        cwd: '<%= tempDir %>',
        expand: true,
        src: ['**/*'],
        dest: '<%= destDir %>'
      }
    },
    jshint: {
      // just lint the source dir
      source: {
        files: {
          src: ['Gruntfile.js', '<%= srcDir %>/app/**/*.js', '!src/app/panels/bar/d3.tip.js']
        }
      },
      options: {
        jshintrc: '.jshintrc'
      }
    },
    htmlmin:{
      build: {
        options:{
          removeComments: true,
          collapseWhitespace: true
        },
        expand: true,
        cwd: '<%= tempDir %>/src',
        src: [
          'index.html',
          'app/panels/**/*.html',
          'app/partials/**/*.html'
        ],
        dest: '<%= tempDir %>/src'
      }
    },
    cssmin: {
      dist: {
        expand: true,
        cwd:'<%= tempDir %>/src/css',
        src: ['**/*.css', '!**/*.min.css'],
        dest: '<%= tempDir %>/src/css/',
        filter: 'isFile',
        ext: '.min.css'
      },
      src: {
        expand: true,
        cwd: '<%= srcDir %>',
        files: [
          {src: '<%= srcDir %>/css/bootstrap.light.css', dest: '<%= srcDir %>/css/bootstrap.light.min.css'},
          {src: '<%= srcDir %>/css/bootstrap.dark.css', dest: '<%= srcDir %>/css/bootstrap.dark.min.css'},
        ]
      }
    },
    ngAnnotate: {
      build: {
        expand:true,
        cwd:'<%= tempDir %>/src',
        src: [
          'app/controllers/**/*.js',
          'app/directives/**/*.js',
          'app/services/**/*.js',
          'app/filters/**/*.js',
          'app/panels/**/*.js',
          'app/app.js',
          'vendor/angular/**/*.js',
          'vendor/solrjs/solr-angular-client.js'
        ],
        dest: '<%= tempDir %>/src'
      }
    },
    requirejs: {
      build: {
        options: {
          appDir: '<%= tempDir %>/src',
          dir: '<%= destDir %>/src',

          mainConfigFile: '<%= tempDir %>/src/app/components/require.config.js',
          modules: [], // populated below

          optimize: 'none',
          optimizeCss: 'none',
          optimizeAllPluginResources: false,

          removeCombined: true,
          findNestedDependencies: true,
          normalizeDirDefines: 'all',
          inlineText: true,
          skipPragmas: true,

          done: function (done, output) {
            var duplicates = require('rjs-build-analysis').duplicates(output);

            if (duplicates.length > 0) {
              grunt.log.subhead('Duplicates found in requirejs build:');
              grunt.log.warn(duplicates);
              done(new Error('r.js built duplicate modules, please check the excludes option.'));
            }

            done();
          }
        }
      }
    },
    uglify: {
      dest: {
        expand: true,
        src: ['**/*.js', '!config.js', '!app/dashboards/*.js'],
        dest: '<%= destDir %>',
        cwd: '<%= destDir %>',
        filter: 'isFile',
        options: {
          quite: true,
          compress: {},
          preserveComments: false,
          banner: '<%= meta.banner %>'
        }
      }
    },
    'git-describe': {
      me: {
        // Target-specific file lists and/or options go here.
      },
    },
    compress: {
      zip: {
        options: {
          archive: '<%= tempDir %>/<%= pkg.name %>-latest.zip'
        },
        files : [
          {
            expand: true,
            cwd: '<%= destDir %>',
            src: ['**/*'],
            dest: '<%= pkg.name %>-latest'
          },
          {
            expand: true,
            src: ['LICENSE.md', 'README.md'],
            dest: '<%= pkg.name %>-latest'
          }
        ]
      },
      tgz: {
        options: {
          archive: '<%= tempDir %>/<%= pkg.name %>-latest.tar.gz'
        },
        files : [
          {
            expand: true,
            cwd: '<%= destDir %>',
            src: ['**/*'],
            dest: '<%= pkg.name %>-latest'
          },
          {
            expand: true,
            src: ['LICENSE.md', 'README.md'],
            dest: '<%= pkg.name %>-latest'
          }
        ]
      }
    }
  };

  // setup the modules require will build
  var requireModules = config.requirejs.build.options.modules = [
    {
      // main/common module
      name: 'app',
      include: [
        'css',
        'kbn',
        'text',
        'jquery',
        'angular',
        'settings',
        'bootstrap',
        'modernizr',
        'solrjs',
        'timepicker',
        'datepicker',
        'underscore',
        'filters/all',
        'jquery.flot',
        'services/all',
        'angular-strap',
        'directives/all',
        'jquery.flot.pie',
        'angular-sanitize',
        'angular-dragdrop',
        'd3'
      ]
    }
  ];

  // create a module for each directory in src/app/panels/
  require('fs')
    .readdirSync(config.srcDir+'/app/panels')
    .forEach(function (panelName) {
      requireModules.push({
        name: 'panels/'+panelName+'/module',
        exclude: ['app']
      });
    });

  // exclude the literal config definition from all modules
  requireModules
    .forEach(function (module) {
      module.excludeShallow = module.excludeShallow || [];
      module.excludeShallow.push('config');
    });

  // Run jshint
  grunt.registerTask('default', ['jshint:source', 'less:src', 'cssmin:src']);

  // Concat and Minify the src directory into dist
  grunt.registerTask('build', [
    'jshint:source',
    'clean:on_start',
    'less:dist',
    'copy:everything_but_less_to_temp',
    'htmlmin:build',
    'cssmin:dist',
    'clean:build',
    'ngAnnotate:build',
    'requirejs:build',
    'copy:everything_to_dist',
    'clean:temp',
    'build:write_revision',
    'uglify:dest'
  ]);

  // run a string replacement on the require config, using the latest revision number as the cache buster
  grunt.registerTask('build:write_revision', function() {
    grunt.event.once('git-describe', function (desc) {
      grunt.config('string-replace.config', {
        src: '<%= destDir %>/app/components/require.config.js',
        dest: '<%= destDir %>/app/components/require.config.js',
        options: {
          replacements: [
            {
              pattern: /(?:^|\/\/)(.*)@REV@/,
              replacement: '$1'+desc.object
            }
          ]
        }
      });

      grunt.task.run('string-replace:config');
    });
    grunt.task.run('git-describe');
  });

  // build, then zip and upload to s3
  grunt.registerTask('distribute', [
    'distribute:load_s3_config',
    'build',
    'compress:zip',
    'compress:tgz',
    's3:dist',
    'clean:temp'
  ]);

  // collect the key and secret from the .aws-config.json file, finish configuring the s3 task
  grunt.registerTask('distribute:load_s3_config', function () {
    var config = grunt.file.readJSON('.aws-config.json');
    grunt.config('s3.options', {
      key: config.key,
      secret: config.secret
    });
  });

  // load plugins
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-git-describe');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify-es');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-compress');


  // pass the config to grunt
  grunt.initConfig(config);

};
