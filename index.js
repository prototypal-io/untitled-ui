/* jshint node: true */
'use strict';

var buildMap = require('./lib/build-imports-map');
var scope = require('./lib/broccoli-scope-scss-imports');
var addMap = require('./lib/broccoli-add-imports-map');
var mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'untitled-ui',

  setupPreprocessorRegistry: function(type, registry) {
    if (type !== 'self') { return; }

    var map = buildMap(registry.app.project.root, {
      include: ['components/**/*.scss']
    });

    registry.add('css', {
      name: 'scope-scss-imports',
      toTree: function(tree) {
        return scope(tree, { map: map });
      }
    });

    registry.add('js', {
      name: 'add-imports-map',
      toTree: function(tree) {
        var mapTree = addMap(tree, { map: map });
        return mergeTrees([tree, mapTree]);
      }
    })
  },

  included: function(app) {
    this._super.included(app);

    app.import('vendor/normalize.css');
  }
};
