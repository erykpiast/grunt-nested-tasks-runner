grunt-nestedtasksrunner
=======================

Nested tasks generator for Grunt.

Example of use
=======================
```javascript
  grunt.initConfig({
    ...
    build: {
      dev: {
        options: { // optional
          concurrent: true, // default `false`
          logConcurrentOutput: true // default `false`
        },
        server: [ 'copy:server' ],
        webapp: {
          options: { // optional
            concurrent: true
          },
          js: [ 'copy:js', 'requirejs:dev' ],
          css: [ 'compass:dev', 'copy:css-assets', 'autoprefixer:dev' ]
        }
      }
    }
    ...
  });
  
  var nestedTask = require('grunt-nestedtasksrunner')(grunt);
  
  grunt.registerTask('build', nestedTask);
```
  
Command `grunt build:dev` runs every task in group `dev`. Task `server` and `webapp` will be run simultaneously, like tasks `js` and `css`.
