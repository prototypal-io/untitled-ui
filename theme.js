/* jshint node: true */
'use strict';
var fs = require('fs');
var bodyParser = require('body-parser');
var cors = require('cors')

var Addon = require('ember-cli/lib/models/addon');

var path = require('path');
var csso = require('broccoli-csso');

var jsPreprocessor = require('./lib/js-preprocessor');
var templatePreprocessor = require('./lib/template-preprocessor');
var scssPreprocessor = require('./lib/scss-preprocessor');

var TransformComponentClasses = require('./lib/transform-component-classes');
var TransformUITableComponents = require('./lib/plugins/transform-ui-table-components');

var UITheme = Addon.extend({
  init: function() {
    this._super.init.apply(this, arguments);
    this._originalCompileStyles = this.compileStyles;
    this.compileStyles = function() {};
  },

  treeForStyles: function() {
    return this._originalCompileStyles(this.treeGenerator(this.root + '/addon/styles'));
  },

  setupPreprocessorRegistry: function(type, registry) {
    this.setupJsPreprocessing(registry, type);

    if (type === 'self') {
      this.setupTemplatePreprocessing(registry);
      this.setupCssPreprocessing(registry);
      this.setupHtmlTransform(registry);
    }

    registry.add('htmlbars-ast-plugin', {
      name: 'transform-ui-table-components',
      plugin: TransformUITableComponents
    });
  },

  setupJsPreprocessing: function(registry, type) {
    registry.add('js', {
      name: 'generate-components-for-scss',
      ext: 'scss',
      _addon: this,
      toTree: function(tree) {
        var destDir = tree.destDir || (tree.inputTree && tree.inputTree.destDir);
        var isTests = /tests$/.test(destDir);
        var isSelf = type === 'self';
        var isParent = type === 'parent';

        var options = {
          registryType: type,
          moduleName: this._addon.name,
          prefix: isSelf ? ('modules/' + this._addon.name) : registry.app.name,
          baseDir: path.join(this._addon.root, 'addon'),
          scss: ['styles/components/*.scss']
        };

        // TODO need a better way of determining app tree from app tests tree
        switch (true) {
          case isTests  : return tree;
          case isSelf   : return jsPreprocessor(tree, options);
          case isParent : return jsPreprocessor(tree, options);
          default       : return tree;
        }
      }
    });
  },

  setupTemplatePreprocessing: function(registry) {
    registry.add('template', {
      name: 'generate-templates-for-scss',
      _addon: this,
      toTree: function(tree) {
        var options = {
          prefix: path.join('modules/', this._addon.name),
          baseDir: path.join(this._addon.root, 'addon'),
          scss: ['styles/components/*.scss']
        };

        return templatePreprocessor(tree, options);
      }
    });
  },

  setupCssPreprocessing: function(registry) {
    var self = this;
    registry.add('css', {
      name: 'mixin-classes',
      toTree: function(tree) {
        return scssPreprocessor(tree, {
          name: self.name,
          components: 'components/*.scss'
        });
      }
    });
  },

  setupHtmlTransform: function(registry) {
    registry.add('htmlbars-ast-plugin', {
      name: 'transform-component-classes',
      plugin: TransformComponentClasses
    });
  },

  postprocessTree: function(type, tree) {
    if (type === 'css') {
      tree = csso(tree);
    }

    return tree;
  },

  serverMiddleware: function(config) {
    var app = config.app;
    var options = config.options;
    var project = options.project;
    var themeFile = path.resolve(path.join(project.root, 'addon', 'styles', 'config.scss'));
    var themeScss = path.resolve(path.join(project.root, 'tests', 'dummy', 'app', 'styles'), 'vars.scss');

    app.use(bodyParser.json());
    app.use(cors());

    app.get('/theme', function(req, res, next) {
      // TODO: read node_modules/*/package.json and extract the metadata for elemental packages
      // send down something like:
      /*
        {
          components: [
            {name: 'ele-calendar', themes: [{backgroundColor: 'units'}]}
          ],
          theme: {
            // contents of theme.json
          }
        }
      */

      let variant = req.query.variant;
      var themeVarsSassFile = path.resolve(path.join(project.root, 'addon', 'styles', 'config' + (variant ? '-' + variant : '') + '.scss'));
      if (fs.existsSync(themeVarsSassFile)) {
        var data = fs.readFileSync(themeVarsSassFile);
        var vars = data.toString().trim().split(/\n+/).map(function(varDecl) {
          var match = varDecl.match(/\$([^:]+):\s+([^;]+)/);
          if (!match) {
            return {name: varDecl};
          }
          return {name: match[1], value: match[2].replace(" !default", "")};
        });
        res.set('Content-Type', 'application/json');
        res.json(vars);
      } else {
        res.json({});
      }
      next();
    });

    app.post('/theme', function(req, res, next) {
      console.log('posted ' + Object.keys(req.body));
      var themeJson = req.body;

      // fs.writeFileSync(themeFile, JSON.stringify(themeJson, null, '  '));
      var scssSource = Object.keys(themeJson).map(function(key) {
        return '$' + key + ': ' + themeJson[key] + ';';
      }).join("\n");
      console.log("scssSource:", scssSource);
      fs.writeFileSync(themeScss, scssSource);
      res.json({theme: req.body});
      next();
    });
  }
});

module.exports = UITheme;
