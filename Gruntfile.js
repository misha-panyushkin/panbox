'use strict';

function makeConcatOptionsWithPostfix (postfix) {
    return {
            banner: "! function (c, window) {" + "\n\n",
            stripBanners: true,
            process: function (src) {
                return '    ' + src.replace(/\r?\n/g, '\n    ') + '\n\n';
            },
            footer: '} (this, this);'
        };
}

module.exports = function (grunt) {

    grunt.file.defaultEncoding = 'utf-8';

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),

        banner: '/* <%= pkg.name || pkg.title %> - v<%= pkg.version %> -' +
                ' <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' <%= pkg.homepage ? "* Homepage: " + pkg.homepage + "\\n" : "" %>' +
                ' <%= pkg.author ? "* Author: " + pkg.author + "\\n" : "" %>' +
                ' * Copyright.*/\n\n',

        concat: {
            app: {
                options: makeConcatOptionsWithPostfix(),

                src: [
                    'src/*.js'
                ],
                dest: 'dev/panbox.js'
            }
        },

        copy: {
            test: {
                expand: true,
                cwd: 'dev/',
                src: '**',
                dest: 'test/',
                flatten: true
            },
        },

        uglify: {
            app: {
                options: {
                    banner: '<%= banner %>'
                },
                files: [{
                    expand: true,
                    cwd: 'dev/',
                    src: '*.js',
                    dest: 'dist/'
                }]
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('dev', [ 
        "concat:app",
        'copy:test'
    ]);

    grunt.registerTask('dist', [ 
        "concat:app",
        'copy:test',
        'uglify:app'
    ]);
};