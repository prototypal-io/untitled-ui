/* jshint node: true */
'use strict';

var path = require('path');

var debug = require('debug')('untitled-ui:resolver');

function Resolver(options) {
  this.moduleNamespace = options.moduleNamespace;
  this.stylesNamespace = options.stylesNamespace;
  this.componentsNamespace = options.componentsNamespace;
  this.templatesNamespace = options.templatesNamespace;
}

Resolver.prototype = {
  baseComponentFor: function(scssFile, context, contexts) {
    if (context.parentThemeName) {
      return this.subthemeBaseComponentFor(scssFile, context, contexts);
    } else {
      return this.basethemeBaseComponentFor(scssFile, context, contexts);
    }
  },

  basethemeBaseComponentFor: function(scssFile, context, contexts) {
    var themeName = context.name;
    var stylesDir = path.join(this.moduleNamespace, themeName, this.stylesNamespace, this.componentsNamespace);
    var componentsDir = path.join(this.moduleNamespace, themeName, this.componentsNamespace);

    var themeComponent = this.themeComponentFor(scssFile, { src: stylesDir, target: componentsDir });
    var themeDefaultComponent = this.themeDefaultComponentFor(themeComponent, { src: componentsDir, target: componentsDir });
    var themeKindComponent = this.themeKindComponentFor({ target: componentsDir });

    debug('%s has component %s', themeName, scssFile.replace(stylesDir+'/', ''));

    switch (true) {
      case isBaseComponent(scssFile, { src: stylesDir }):
        debug('but it is a base component');
        return false;
      case existsIn(themeComponent, context.js):
        debug('but %s exists already', themeComponent);
        return false;
      case existsIn(themeDefaultComponent, context.js):
        debug('which resolved to %s', themeDefaultComponent);
        return this.tupleFor(themeDefaultComponent, context.hbs);
      case existsIn(themeKindComponent, context.js):
        debug('which resolved to %s', themeKindComponent);
        return this.tupleFor(themeKindComponent, context.hbs);
      default:
        throw new Error('could not resolve %s to a baser component', scssFile);
    }
  },

  subthemeBaseComponentFor: function(scssFile, context, contexts) {
    var themeName = context.name;
    var stylesDir = path.join(this.moduleNamespace, themeName, this.stylesNamespace, this.componentsNamespace);
    var componentsDir = path.join(this.moduleNamespace, themeName, this.componentsNamespace);

    var themeComponent = this.themeComponentFor(scssFile, { src: stylesDir, target: componentsDir });
    var themeDefaultComponent = this.themeDefaultComponentFor(themeComponent, { src: componentsDir, target: componentsDir });

    var parentThemeName = context.parentThemeName;
    var parentThemeContext = contexts[parentThemeName];
    var parentStylesDir = path.join(this.moduleNamespace, parentThemeName, this.stylesNamespace, this.componentsNamespace);
    var parentComponentsDir = path.join(this.moduleNamespace, parentThemeName, this.componentsNamespace);

    var parentThemeScssFile = scssFile.replace(context.prefix + '--', '').replace(themeName, parentThemeName);
    var parentThemeComponent = this.themeComponentFor(parentThemeScssFile, { src: parentStylesDir, target: parentComponentsDir });
    var parentThemeDefaultComponent = this.themeDefaultComponentFor(parentThemeComponent, { src: parentComponentsDir, target: parentComponentsDir });
    var parentThemeKindComponent = this.themeKindComponentFor({ target: parentComponentsDir });

    debug('%s has component %s', themeName, scssFile.replace(stylesDir+'/', ''));

    switch (true) {
      case existsIn(themeComponent, context.js):
        debug('but %s exists already', themeComponent);
        return false;
      case existsIn(themeDefaultComponent, context.js):
        debug('which resolved to %s', themeDefaultComponent);
        return this.tupleFor(themeDefaultComponent, context.hbs);
      case existsIn(parentThemeComponent, parentThemeContext.js):
        debug('which resolved to %s', parentThemeComponent);
        return this.tupleFor(parentThemeComponent, parentThemeContext.hbs);
      case existsIn(parentThemeDefaultComponent, parentThemeContext.js):
        debug('which resolved to %s', parentThemeDefaultComponent);
        return this.tupleFor(parentThemeDefaultComponent, parentThemeContext.hbs);
      case existsIn(parentThemeKindComponent, parentThemeContext.js):
        debug('which resolved to %s', parentThemeKindComponent);
        return this.tupleFor(parentThemeKindComponent, parentThemeContext.hbs);
      default:
        throw new Error('could not resolve %s to a baser component', scssFile);
    }
  },

  themeComponentFor: function(scssFile, dirs) {
    var pattern = new RegExp(dirs.src + '\/(.+)\.scss$');
    return scssFile.replace(pattern, dirs.target + '/$1.js');
  },

  themeDefaultComponentFor: function(componentFile, dirs) {
    var pattern = new RegExp(dirs.src + '\/(.+)--.+\.js$');
    return componentFile.replace(pattern, dirs.target + '/$1--default.js');
  },

  themeKindComponentFor: function(dirs) {
    return path.join(dirs.target, 'ui-kind.js');
  },

  tupleFor: function(jsComponent, templateContextFiles) {
    var hbsComponent = jsComponent.replace(this.componentsNamespace, this.templatesNamespace + '/' + this.componentsNamespace);
    hbsComponent = hbsComponent.replace(/\.js$/, '.hbs');

    if (!existsIn(hbsComponent, templateContextFiles)) {
      throw new Error('must define ' + hbsComponent + ' for component: ' + jsComponent);
    }

    return { js: jsComponent, hbs: hbsComponent };
  }
};

function isBaseComponent(scssFile, dirs) {
  var isKind = new RegExp(dirs.src + '\/ui-kind\.scss$').test(scssFile);
  var isBase = new RegExp(dirs.src + '\/.+--base\.scss$').test(scssFile);
  return isKind || isBase;
}

function existsIn(componentFile, contextFiles) {
  return contextFiles.indexOf(componentFile) > -1;
}

module.exports = Resolver;
