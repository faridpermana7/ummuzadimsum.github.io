// Grunt tasks

module.exports = function (grunt) {
    "use strict";

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
            '* <%= pkg.name %> - v<%= pkg.version %> - ISC LICENSE. FARST <%= grunt.template.today("yyyy-mm-dd") %>. \n' +
            '* @author <%= pkg.author %>\n' +
            '*/\n',

        clean: {
            dist: ['dist']
        },

        replace: {
            base: {
                options: {
                    patterns: [{
                        json: require('./package.json')
                    }]
                },
                files: [
                    { expand: true, flatten: true, src: ['./config/app.config.js'], dest: './app/' }
                ]
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            // app: {
            //     src: ['app/assets/report/**/*.js', 'app/assets/modules/**/*.js']
            // }
        },

        exec: {
            npmInstaller: 'npm install'
        },

        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: false
            },
            base: {
                src: [
                    //Angular Project Dependencies,

                    'src/directive/*Directive.js',
                    // 'src/js/*Service.js', 
                    'src/**/*Route.js'

                ],
                dest: 'dist/app/assets/js/<%= pkg.name %>-mod.<%= pkg.version %>.<%= pkg.build %>.js'
            },
            root: {
                src: [
                    'src/app.js',
                    'lib/wow/wow.js',
                    'lib/owlcarousel/owl.carousel.js',
                    'src/main.js',
                    'lib/farst-lib.js',
                    'lib/bootstrapDatetimePicker.js',
                    'lib/crypto.js',
                    'lib/qrcode.js',
                    'config/app.config.js',
                ],
                dest: 'dist/app/assets/js/<%= pkg.name %>-app.config.<%= pkg.version %>.<%= pkg.build %>.js'
            },
            main: {
                src: [
                    //Angular Project Dependencies, 
                    'src/**/*Ctrl.js',
                    'src/**/*Controller.js',
                    'src/**/*Factory.js',
                    'src/**/*Service.js',
                    'src/layout/**/*Directive.js',
                    'src/login/**/*Directive.js',
                    'src/manage/**/*Directive.js',
                    'src/sys/**/*Directive.js',
                    'src/pages/**/*Directive.js'
                ],
                dest: 'dist/app/assets/js/<%= pkg.name %>-app.<%= pkg.version %>.<%= pkg.build %>.js'
            },
            build: {
                src: [  
                    // Angular Project Dependencies,
                    'node_modules/jquery/dist/jquery.min.js',
                    'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
                    'node_modules/angular/angular.js',
                    'node_modules/angular-ui-router/release/angular-ui-router.min.js',
                    // 'node_modules/angular-ui-router/release/angular-ui-router.min.js.map',
                    'node_modules/angular-cookies/angular-cookies.min.js',
                    // 'node_modules/angular-cookies/angular-cookies.min.js.map',
                    'node_modules/angular-breadcrumb/dist/angular-breadcrumb.min.js',
                    'node_modules/angular-animate/angular-animate.js',
                    'node_modules/angular-touch/angular-touch.js',
                    'node_modules/angular-sanitize/angular-sanitize.js',
                    "node_modules/angular-datatables/dist/angular-datatables.min.js",
                    'node_modules/angular-datatables/dist/plugins/scroller/angular-datatables.scroller.min.js',
                    'node_modules/angular-datatables/dist/plugins/select/angular-datatables.select.min.js',
                    'node_modules/angular-datatables/dist/plugins/fixedcolumns/angular-datatables.fixedcolumns.js',

                    'node_modules/ui-bootstrap4/dist/ui-bootstrap-tpls.js',  
                    'node_modules/sweetalert2/dist/sweetalert2.all.min.js',
                    'node_modules/underscore/underscore-min.js',
                    'node_modules/moment/moment.js',
                    'node_modules/moment-timezone/moment-timezone.js', 
                    'node_modules/html2canvas/dist/html2canvas.min.js',
                    'node_modules/select2/dist/js/select2.js',
                    'node_modules/ui-select/dist/select.min.js',

                    'node_modules/datatables/media/js/jquery.dataTables.min.js',
                    'node_modules/datatables-scroller/js/dataTables.scroller.js',
                    'node_modules/datatables.net-select/js/dataTables.select.js',
                    'node_modules/datatables.net-fixedcolumns/js/dataTables.fixedColumns.js', 
                    'node_modules/datatables.net-rowgroup/js/dataTables.rowGroup.js', 
                    
                    'node_modules/leaflet/dist/leaflet.js',
                    'node_modules/leaflet/dist/leaflet-src.js', 
                    // 'node_modules/leaflet/dist/leaflet-src.esm.js',
                    'node_modules/leaflet.markercluster/dist/leaflet.markercluster*.js*', 
                ],
                dest: 'dist/app/assets/js/<%= pkg.name %>-libs.<%= pkg.version %>.<%= pkg.build %>.js'
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>',
                report: 'min'
            },
            base: {
                src: [
                    'dist/app/assets/js/<%= pkg.name %>-libs.<%= pkg.version %>.<%= pkg.build %>.js',

                ],
                dest: 'dist/app/assets/js/<%= pkg.name %>-dist.min.<%= pkg.version %>.<%= pkg.build %>.js'
            },
            basePlugin: {
                src: ['src/plugins/**/*.js'],
                dest: 'app/app/assets/js/plugins/',
                expand: true,
                flatten: true,
                ext: '.min.js'
            }
        },
        //Copy all files for distribution only
        //All app js & css will be append versioning on filename and banner.
        copy: {
            prod: {

                files: [

                    {
                        expand: true, src: ['index.html'],
                        dest: 'dist/app'
                    }]
            },
            main: {

                files: [
                    {
                        expand: true, 
                        cwd:'src/images/',
                        src: ['**'],
                        dest: 'dist/src/images'
                    },
                    {
                        expand: true, 
                        cwd:'src/images',
                        src: ['carousel-1.jpg', 'bg-icon.png'],
                        dest: 'dist/app/assets/images'
                    },
                    {
                        expand: true, 
                        cwd:'src/img',
                        src: ['**'], 
                        dest: 'dist/app/assets/images'
                    },
                    {
                        expand: true, 
                        cwd:'src/css/',
                        src: ['**'],
                        dest: 'dist/app/assets/css'
                    }, 
                    {
                        expand: true, 
                        cwd:'src/json/',
                        src: ['**'],
                        dest: 'dist/app/assets/json'
                    },
                    // {
                    //     expand: true, src: ['src/fonts/**'],
                    //     dest: 'dist'
                    // },
                    {
                        expand: true,
                        src: ['node_modules/leaflet/dist/images/**'],
                        dest: 'dist/app/assets/css/',
                        rename: function (dest, src) {
                            return dest + src.replace('node_modules/leaflet/dist/', '');
                        }
                    }, 
                    {
                        expand: true, src: ['index.html'],
                        dest: 'dist/'
                    }
                ]
            }
        },

        connect: {
            server: {
                options: {
                    keepalive: true,
                    port: 4000,
                    base: '.',
                    hostname: 'localhost',
                    debug: true,
                    livereload: false,
                    open: true
                }
            }
        },

        concurrent: {
            tasks: ['connect', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },

        watch: {
            app: {
                files: '<%= jshint.app.src %>',
                tasks: ['jshint:app'],
                options: {
                    livereload: true
                }
            }
        },

        injector: {
            options: {},
            dev: {
                files: {
                    'index.html': [
                        'lib/animate/animate.min.css',
                        'lib/owlcarousel/assets/owl.carousel.min.css',
                        'lib/tailwind/tailwind.min.css',

                        'src/css/bootstrap.min.css',
                        'node_modules/datatables/media/css/jquery.dataTables.min.css',
                        'node_modules/sweetalert2/dist/sweetalert2.min.css',
                        'node_modules/angular-datatables/dist/css/angular-datatables.min.css',
                        'node_modules/ui-select/dist/select.css',
                        'node_modules/datatables/media/css/jquery.dataTables.min.css',
                        'node_modules/angular-datatables/dist/css/angular-datatables.min.css',
                        'node_modules/ui-select/dist/select.css',

                        'node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css',
                        'node_modules/leaflet.markercluster/dist/MarkerCluster.css',
                        'node_modules/leaflet/dist/leaflet.css', 
                        'src/css/*.css',
                        // 'app/assets/css/**/*.css',
                        //'app/assets/js/<%= pkg.name %>-libs.<%= pkg.version %>.<%= pkg.build %>.js',
                        
                        'node_modules/jquery/dist/jquery.min.js',
                        'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
                        'node_modules/angular/angular.js',
                        'node_modules/angular-ui-router/release/angular-ui-router.min.js',
                        // 'node_modules/angular-ui-router/release/angular-ui-router.min.js.map',
                        'node_modules/angular-cookies/angular-cookies.min.js',
                        // 'node_modules/angular-cookies/angular-cookies.min.js.map',
                        'node_modules/angular-breadcrumb/dist/angular-breadcrumb.min.js',
                        'node_modules/angular-animate/angular-animate.js',
                        'node_modules/angular-touch/angular-touch.js',
                        'node_modules/angular-sanitize/angular-sanitize.js',
                        "node_modules/angular-datatables/dist/angular-datatables.min.js",
                        'node_modules/angular-datatables/dist/plugins/scroller/angular-datatables.scroller.min.js',
                        'node_modules/angular-datatables/dist/plugins/select/angular-datatables.select.min.js',
                        'node_modules/angular-datatables/dist/plugins/fixedcolumns/angular-datatables.fixedcolumns.js',

                        'node_modules/ui-bootstrap4/dist/ui-bootstrap-tpls.js',  
                        'node_modules/sweetalert2/dist/sweetalert2.all.min.js',
                        'node_modules/underscore/underscore-min.js',
                        'node_modules/moment/moment.js',
                        'node_modules/moment-timezone/moment-timezone.js', 
                        'node_modules/html2canvas/dist/html2canvas.min.js',
                        'node_modules/select2/dist/js/select2.js',
                        'node_modules/ui-select/dist/select.min.js',

                        'node_modules/datatables/media/js/jquery.dataTables.min.js',
                        'node_modules/datatables-scroller/js/dataTables.scroller.js',
                        'node_modules/datatables.net-select/js/dataTables.select.js',
                        'node_modules/datatables.net-fixedcolumns/js/dataTables.fixedColumns.js', 
                        'node_modules/datatables.net-rowgroup/js/dataTables.rowGroup.js', 
                        
                        'node_modules/leaflet/dist/leaflet.js',
                        'node_modules/leaflet/dist/leaflet-src.js',
                        'node_modules/leaflet.markercluster/dist/leaflet.markercluster*.js*', 
                        
                        'src/app.js',
                        'lib/wow/wow.js',
                        'lib/owlcarousel/owl.carousel.js',
                        'src/main.js',
                        'lib/farst-lib.js',
                        'lib/bootstrapDatetimePicker.js',
                        'lib/crypto.js',
                        'lib/qrcode.js',
                        'config/app.config.js',
                        
                        'src/js/farstFactory.js',
                        'src/**/*Service.js',
                        'src/**/*Ctrl.js',
                        'src/**/*Controller.js',
                        'src/**/*Route.js',
                        'src/directive/*Directive.js',
                        'src/layout/**/*Directive.js',
                        'src/login/**/*Directive.js',
                        'src/manage/**/*Directive.js',
                        'src/sys/**/*Directive.js',
                        'src/pages/**/*Directive.js'  
                    ]
                }
            },
            production: {
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: [ 
                        'app/assets/css/<%= pkg.name %>-style.min.<%= pkg.version %>.<%= pkg.build %>.css',
                        'app/assets/js/<%= pkg.name %>-dist.min.<%= pkg.version %>.<%= pkg.build %>.js',
                        'app/assets/js/<%= pkg.name %>-app.config.<%= pkg.version %>.<%= pkg.build %>.js',
                        'app/assets/js/<%= pkg.name %>-mod.<%= pkg.version %>.<%= pkg.build %>.js',
                        'app/assets/js/<%= pkg.name %>-app.<%= pkg.version %>.<%= pkg.build %>.js',
                        'app/assets/js/<%= pkg.name %>-templates.<%= pkg.version %>.<%= pkg.build %>.js'
                    ]

                }],
                options: {
                    cwd: 'dist/',
                    template: 'dist/index.html',
                    destFile: 'dist/index.html',
                    addRootSlash: true,
                    relative: true,
                    transform: function (filepath, index, length) {

                        var isJs = grunt.file.isMatch({ matchBase: true }, '*.js', filepath);
                        var isCss = grunt.file.isMatch({ matchBase: true }, '*.css', filepath);
                        var isHtml = grunt.file.isMatch({ matchBase: true }, '*.html', filepath);

                        if (isJs) {
                            return '<script src="' + filepath + '"></script>';
                        }

                        if (isCss) {
                            return '<link rel="stylesheet" href="' + filepath + '" media="all">';
                        }

                        if (isHtml) {
                            return '<link rel="import" href="' + filepath + '">';
                        }
                    }
                }
            }
        },



        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1,
                banner: '<%= banner %>',
            },

            target: {

                files: {
                    'dist/app/assets/css/<%= pkg.name %>-style.min.<%= pkg.version %>.<%= pkg.build %>.css': [

                        'lib/animate/animate.min.css',
                        'lib/owlcarousel/assets/owl.carousel.min.css',
                        'lib/tailwind/tailwind.min.css',

                        'src/css/bootstrap.min.css',
                        'node_modules/datatables/media/css/jquery.dataTables.min.css',
                        'node_modules/sweetalert2/dist/sweetalert2.min.css',
                        'node_modules/angular-datatables/dist/css/angular-datatables.min.css',
                        'node_modules/ui-select/dist/select.css',
                        'node_modules/datatables/media/css/jquery.dataTables.min.css',
                        'node_modules/angular-datatables/dist/css/angular-datatables.min.css',
                        'node_modules/ui-select/dist/select.css',

                        'node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css',
                        'node_modules/leaflet.markercluster/dist/MarkerCluster.css',
                        'node_modules/leaflet/dist/leaflet.css', 
                        'src/css/*.css',
                    ]
                }
            }
        },

        ngtemplates: {
            app: {
                src: [
                    'src/layout/**/*.html', 
                    'src/login/**/*.html', 
                    'src/manage/**/*.html', 
                    'src/pages/**/*.html', 
                    'src/sys/**/*.html'
                ],
                dest: 'dist/app/assets/js/<%= pkg.name %>-templates.<%= pkg.version %>.<%= pkg.build %>.js',
                options: {
                    module: '<%= pkg.name %>',
                    root: '/app',
                    standAlone: false
                }
            }
        }



    });

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);


    // Making grunt default to force in order not to break the project if something fail.
    grunt.option('force', true);

    // Register grunt for release
    grunt.registerTask("build", [
        "clean",
        "replace",
        "jshint",
        "cssmin",
        "concat:base",
        "concat:root",
        "concat:main",
        "concat:build",
        "ngtemplates",
        "uglify",
        "copy:main",
        "injector:production"
        // "concurrent",
        // "clean"
    ]);

    // Register grunt tasks for deps installer
    grunt.registerTask("install", [
        "exec"
    ]);

    // Development task(s).
    grunt.registerTask('dev', [
        "replace",
        "jshint",
        'injector:dev',
        'concurrent'
    ]);

};
