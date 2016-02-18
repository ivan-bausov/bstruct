/**
 * Copyright (c) 2016 Ivan Bausov <ivan.bausov@gmail.com> (MIT Licensed)
 * A part of B:STRUCT package <https://github.com/ivan-bausov/bstruct>
 */
module.exports = function (grunt) {
    grunt.initConfig({
        ts: {
            compile: {
                src: [
                    "./**/*.t.ts",
                    "./**/*.i.ts"
                ],
                options: {
                    target: 'es5',
                    module: 'commonjs',
                    declaration: false,
                    removeComments: true,
                    sourceMap: false
                }
            }
        },

        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        src: [
                            '*.t.js',
                            '*.e.js',
                            'bin/bstruct',
                            'index.js',
                            'README.md'
                        ],
                        dest: 'production',
                        cwd: './'
                    }
                ]
            },
            package: {
                src: 'production_package.json',
                dest: 'production/package.json'
            }
        },

        clean: {
            prod: ['production']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-ts");

    grunt.registerTask('build', ['ts', 'clean', 'copy']);
};

