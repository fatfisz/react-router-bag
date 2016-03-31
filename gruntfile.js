'use strict';

const loadGruntTasks = require('load-grunt-tasks');
const rollupPluginBabel = require('rollup-plugin-babel');


module.exports = function register(grunt) {
  loadGruntTasks(grunt);

  grunt.initConfig({
    eslint: {
      all: ['lib', 'test'],
    },

    clean: {
      all: ['dist'],
    },

    rollup: {
      all: {
        options: {
          external: [
            'not-found-error',
            'react',
            'react-router',
          ],
          plugins: [
            rollupPluginBabel(),
          ],
          format: 'cjs',
        },
        files: {
          'dist/index.rollup.js': 'lib/index.js',
        },
      },
    },

    babel: {
      all: {
        files: [{
          expand: true,
          cwd: 'lib/',
          src: '**/*.js',
          dest: 'dist/',
        }],
      },
    },

    mochaTest: {
      test: {
        options: {
          timeout: 500,
        },
        src: [
          'test/boot.js',
          'test/**/*.test.js',
        ],
      },
    },

  });

  grunt.registerTask('prepublish', ['eslint', 'clean', 'babel', 'rollup']);
  grunt.registerTask('test', ['prepublish', 'mochaTest']);

  grunt.registerTask('default', ['test']);
};
