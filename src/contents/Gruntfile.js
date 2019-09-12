
// wrapper function
module.exports = function(grunt) {
    // configuration object
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // bower libraries concatenation
        bower_concat: {
            all: {
                options: { separator : ';' },
                dest: {
                    js: 'js/vendor/bower.js',
                    css: 'css/bower.css',
                },
            }
        },

        // js concatenation
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['js/vendor/bower.js','js/main.js','js/**/*.js'],
                dest: 'build/app.js',
            }
        },

        // js minification and compression
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
                    'build/app.min.css': ['css/**/*.css']
                }
            }
        },
    });

    // load in the grunt plugins
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-ng-annotate');

    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask('default', ['bower_concat', 'concat', 'uglify', 'cssmin']);
    grunt.registerTask('build', ['bower_concat', 'concat', 'uglify', 'cssmin']);
    grunt.registerTask('update_dependencies', ['bower_concat']);
};