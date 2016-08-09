/* jshint node: true */
'use strict';

var path = require('path');

var debug = require('debug')('untitled-ui:resolver');

function Resolver(options) {
  this.moduleNamespace = options.moduleNamespace;
  this.stylesNamespace = options.stylesNamespace;
  this.componentsNamespace = options.componentsNamespace;
  this.templatesNamespace = options.templatesNamespace;

  this.stylesDir = null;
  this.componentsDir = null;
  this.parentComponentsDir = null;
}

Resolver.prototype = {
  baseComponentFor: function(scssFile, themeName, contexts, type) {
    var context = contexts[themeName];

    switch (type) {
      case 'js':
        this.componentsDir = path.join(this.moduleNamespace, themeName, this.componentsNamespace);
        break;
      case 'hbs':
        this.componentsDir = path.join(this.moduleNamespace, themeName, this.templatesNamespace, this.componentsNamespace);
        break;
      default:
        throw new Error('resolver encountered unknown type: ' + type);
    }

    this.stylesDir = path.join(this.moduleNamespace, themeName, this.stylesNamespace, this.componentsNamespace);

    if (context.parentThemeName) {
      var replace = new RegExp('^(.+)\/'+themeName+'\/(.+)$');
      this.parentComponentsDir = this.componentsDir.replace(replace, '$1/' + context.parentThemeName + '/$2');
      this.parentStylesDir = path.join(this.moduleNamespace, context.parentThemeName, this.stylesNamespace, this.componentsNamespace);

      return this.subthemeBaseComponentFor(scssFile, themeName, contexts, type);
    } else {
      return this.basethemeBaseComponentFor(scssFile, themeName, contexts, type);
    }
  },

  basethemeBaseComponentFor: function(scssFile, themeName, contexts, type) {
    var context = contexts[themeName];

    var themeComponent = this.themeComponentFor(scssFile, type, { src: this.stylesDir, target: this.componentsDir });
    var themeDefaultComponent = this.themeDefaultComponentFor(themeComponent, type, { src: this.componentsDir, target: this.componentsDir });
    var themeKindComponent = this.themeKindComponentFor(type, { target: this.componentsDir });

    debug('%s has component %s', themeName, scssFile.replace(this.stylesDir+'/', ''));

    switch (true) {
      case isBaseComponent(scssFile, { src: this.stylesDir }):
        debug('but it is a base component');
        return false;
      case existsIn(themeComponent, context[type]):
        debug('but %s exists already', themeComponent);
        return false;
      case existsIn(themeDefaultComponent, context[type]):
        debug('which resolved %s to %s', type, themeDefaultComponent);
        return themeDefaultComponent;
      case existsIn(themeKindComponent, context[type]):
        debug('which resolved %s to %s', type, themeKindComponent);
        return themeKindComponent;
      default:
        throw new Error('could not resolve ' + scssFile + ' to a baser component for type ' + type);
    }
  },

  subthemeBaseComponentFor: function(scssFile, themeName, contexts, type) {
    var context = contexts[themeName];
    var parentThemeContext = contexts[context.parentThemeName];

    var themeComponent = this.themeComponentFor(scssFile, type, { src: this.stylesDir, target: this.componentsDir });
    var themeDefaultComponent = this.themeDefaultComponentFor(themeComponent, type, { src: this.componentsDir, target: this.componentsDir });

    var parentThemeScssFile = scssFile.replace(context.prefix + '--', '').replace(themeName, context.parentThemeName);
    var parentThemeComponent = this.themeComponentFor(parentThemeScssFile, type, { src: this.parentStylesDir, target: this.parentComponentsDir });
    var parentThemeDefaultComponent = this.themeDefaultComponentFor(parentThemeComponent, type, { src: this.parentComponentsDir, target: this.parentComponentsDir });
    var parentThemeKindComponent = this.themeKindComponentFor(type, { target: this.parentComponentsDir });

    debug('%s has component %s', themeName, scssFile.replace(this.stylesDir+'/', ''));

    switch (true) {
      case existsIn(themeComponent, context[type]):
        debug('but %s exists already', themeComponent);
        return false;
      case existsIn(themeDefaultComponent, context[type]):
        debug('which resolved %s to %s', type, themeDefaultComponent);
        return themeDefaultComponent;
      case existsIn(parentThemeComponent, parentThemeContext[type]):
        debug('which resolved %s to %s', type, parentThemeComponent);
        return parentThemeComponent;
      case existsIn(parentThemeDefaultComponent, parentThemeContext[type]):
        debug('which resolved %s to %s', type, parentThemeDefaultComponent);
        return parentThemeDefaultComponent;
      case existsIn(parentThemeKindComponent, parentThemeContext[type]):
        debug('which resolved %s to %s', type, parentThemeKindComponent);
        return parentThemeKindComponent;
      default:
        throw new Error('could not resolve ' + scssFile + ' to a baser component for type ' + type);
    }
  },

  themeComponentFor: function(scssFile, type, dirs) {
    var pattern = new RegExp(dirs.src + '\/(.+)\.scss$');
    return scssFile.replace(pattern, dirs.target + '/$1.' + type);
  },

  themeDefaultComponentFor: function(componentFile, type, dirs) {
    var pattern = new RegExp(dirs.src + '\/(.+)--.+\.' + type + '$');
    return componentFile.replace(pattern, dirs.target + '/$1--default.' + type);
  },

  themeKindComponentFor: function(type, dirs) {
    return path.join(dirs.target, 'ui-kind.' + type);
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
