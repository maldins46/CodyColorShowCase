// wrapper function
module.exports = function (grunt) {
    // configuration object
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // bower libraries concatenation
        bower_concat: {
            all: {
                options: {separator: ';'},
                mainFiles: {
                    'firebase': ['firebase-app.js', 'firebase-auth.js'],
                },
                exclude: ['components-font-awesome'],
                dest: {
                    js: 'js/vendor/bower.js',
                    css: 'css/bower.css'
                },
            }

        },

        // js concatenation
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['js/vendor/bower.js', 'js/main.js', 'js/**/*.js'],
                dest: 'build/app.js',
            }

        },

        // js minification and compression with ES6 plugin
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'build/app.min.js': 'build/app.js'
                }
            }
        },

        // css concatenation and minification
        cssmin: {
            target: {
                files: {
                    // it is important to concatenate in this order
                    'build/app.min.css': [
                        'css/normalize.css',
                        'css/fontawesome.css',
                        'bower.css',
                        'css/main.css',
                        'css/firebase-ui-custom.css'
                    ]
                }
            }

        },

        // create index files using different imports based on the release type
        'string-replace': {
            build: {
                dist: {
                    files: {
                        dest: 'index.html',
                        src: ['./index-model/index-model.html']
                    }
                },
                options: {
                    replacements: [
                        {
                            pattern: '<!--javascript-import-->',
                            replacement: '<%= grunt.file.read(\'index-model/javascript-import.html\') %>'
                        },
                        {
                            pattern: '<!--css-import-->',
                            replacement: '<%= grunt.file.read(\'index-model/css-import.html\') %>'
                        }
                    ]
                }
            },
            'build-beta': {
                dist: {
                    files: {
                        'index.html': 'index-model/index-model.html'
                    }
                },
                options: {
                    replacements: [
                        {
                            pattern: /<!--javascript-import-->/ig,
                            replacement: '<%= grunt.file.read(\'index-model/javascript-import-beta.html\') %>'
                        },
                        {
                            pattern: /<!--css-import-->/ig,
                            replacement: '<%= grunt.file.read(\'index-model/css-import-beta.html\') %>'
                        }
                    ]
                }
            }
        },

        // delete intermediate files
        clean: ['build/app.js']
    });

    // load in the grunt plugins
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-string-replace');

    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask('build', ['bower_concat', 'concat', 'uglify', 'cssmin', 'clean', 'string-replace:build']);
    grunt.registerTask('build-beta', ['string-replace:build-beta']);
    grunt.registerTask('update_dependencies', ['bower_concat']);
};