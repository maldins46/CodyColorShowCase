// wrapper function
module.exports = function (grunt) {
    // configuration object
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // copy files in build directory
        copy: {
            build: {
                files: [
                    // copy all files excluded js, css, bower and index
                    {
                        expand: true,
                        cwd: 'src/',
                        src: [
                            '**/*',
                            '!contents/bower.json',
                            '!contents/index.html',
                            '!contents/js/**',
                            '!contents/css/**',
                            '!contents/bower_components/**'
                        ],
                        dest: 'build/'
                    },
                ],
            },
            'build-beta': {
                files: [
                    // copy all files excluded bower and index
                    {
                        expand: true,
                        cwd: 'src/',
                        src: [
                            '**/*',
                            '!contents/bower.json',
                            '!contents/index.html',
                            '!contents/bower_components/**'
                        ],
                        dest: 'build/'
                    },
                ],
            },
        },

        // copy necessaries bower file inside js
        bower: {
            all: {
                dest: 'src/contents/js/bower',
                js_dest: 'src/contents/js/bower',
                css_dest: 'src/contents/css/bower',
                options: {
                    keepExpandedHierarchy: false,
                    ignorePackages: ['components-font-awesome'],
                    packageSpecific: {
                        'firebase': {
                            files: [ 'firebase-app.js', 'firebase-auth.js' ]
                        }
                    },
                }
            }
        },

        // concatenates all javascript files in one, in a specific order
        concat: {
            options: {
                separator: ';'
            },
            build: {
                src: [
                    'src/contents/js/bower/*.js',
                    'src/contents/js/main.js',
                    'src/contents/js/**/*.js'
                ],
                dest: 'build/contents/js/app/app.js',
            }
        },

        // js minification and compression with ES6 plugin
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            build: {
                files: {
                    'build/contents/js/app/app.min.js': 'build/contents/js/app/app.js'
                }
            }
        },

        // css concatenation and minification
        cssmin: {
            build: {
                files: {
                    // it is important to concatenate in this order
                    'build/contents/css/app.min.css': [
                        'src/contents/css/normalize.css',
                        'src/contents/css/fontawesome.css',
                        'src/contents/css/bower/*.css',
                        'src/contents/css/main.css',
                        'src/contents/css/firebase-ui-custom.css'
                    ]
                }
            }
        },

        includeSource: {
            options: {
                basePath: ['build/contents/'],
                templates: {
                    html: {
                        js: '<script src="{filePath}"></script>',
                        css: '<link rel="stylesheet" type="text/css" href="{filePath}" />',
                    },
                }
            },
            all: {
                files: {
                    'build/contents/index.html': 'src/contents/index.html'
                }
            },
        },

        shell: {
            all: {
                command: 'workbox injectManifest workbox-config.js'
            }
        },

        // delete temporary files
        clean: {
            preclean: ['build/**'],
            build: [
                'build/contents/js/app/app.js',
                'src/contents/js/bower',
                'src/contents/css/bower',
            ],
            'build-beta': [
                'src/contents/js/bower',
                'src/contents/css/bower',
            ]
        }
    });

    // load in the grunt plugins
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-include-source');
    grunt.loadNpmTasks('grunt-shell');

    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask('build', [
        'clean:preclean', 'copy:build','bower', 'concat',
        'uglify', 'cssmin', 'clean:build', 'includeSource', 'shell'
    ]);
    grunt.registerTask('build-beta', ['clean:preclean', 'bower', 'copy:build-beta',
        'clean:build-beta','includeSource', 'shell']);

};