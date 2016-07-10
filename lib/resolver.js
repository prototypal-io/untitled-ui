/* jshint node: true */
'use strict';

var path = require('path');

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

    switch (true) {
      case isBaseComponent(scssFile, { src: stylesDir }):
        // console.log('BASE - dont generate');
        return false;
      case existsIn(themeComponent, context.js):
        // console.log('EXISTS - dont generate');
        return false;
      case existsIn(themeDefaultComponent, context.js):
        // console.log('DEFAULT EXISTS - generate from: ' + themeDefaultComponent);
        return this.tupleFor(themeDefaultComponent, context.hbs);
      case existsIn(themeKindComponent, context.js):
        // console.log('KIND EXISTS - generate from: ' + themeKindComponent);
        return this.tupleFor(themeKindComponent, context.hbs);
      default:
        throw new Error('could not find base component to generate for ' + scssFile);
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

    switch (true) {
      case existsIn(themeComponent, context.js):
        // console.log('EXISTS - dont generate');
        return false;
      case existsIn(themeDefaultComponent, context.js):
        // console.log('DEFAULT EXISTS - generate from: ' + themeDefaultComponent);
        return this.tupleFor(themeDefaultComponent, context.hbs);
      case existsIn(parentThemeComponent, parentThemeContext.js):
        // console.log('PARENT EXISTS - generate from: ', parentThemeComponent);
        return this.tupleFor(parentThemeComponent, parentThemeContext.hbs);
      case existsIn(parentThemeDefaultComponent, parentThemeContext.js):
        // console.log('PARENT DEFAULT EXISTS - generate from: ' + parentThemeDefaultComponent);
        return this.tupleFor(parentThemeDefaultComponent, parentThemeContext.hbs);
      case existsIn(parentThemeKindComponent, parentThemeContext.js):
        // console.log('PARENT KIND EXISTS - generate from: ' + parentThemeKindComponent);
        return this.tupleFor(parentThemeKindComponent, parentThemeContext.hbs);
      default:
        throw new Error('could not find base component to generate for ' + scssFile);
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
  var isDefault = new RegExp(dirs.src + '\/.+--default\.scss$').test(scssFile);
  return isKind || isBase || isDefault;
}

function existsIn(componentFile, contextFiles) {
  return contextFiles.indexOf(componentFile) > -1;
}

module.exports = Resolver;
