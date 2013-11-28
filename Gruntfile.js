module.exports = function(grunt){
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint:{
            options: {
                jshintrc: '.jshintrc'
            },
            all:['app/scripts/**/*.js']
        },
        concat:{
            options:{
                seperator: ';'
            },
            my_js:{
                src: ['app/scripts/**/*.js'], dest: 'dist/scripts/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                mangle: false,
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                  'dist/scripts/<%= pkg.name %>.min.js': ['<%= concat.my_js.dest %>']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //Default task to run --> command: grunt
    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
}