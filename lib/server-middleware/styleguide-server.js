function StyleguideServer(options) {
  this.themeCore = options.themeCore;
}

StyleguideServer.prototype.addServerMiddleware = function(startOptions) {
  var app = startOptions.app;
  var themes = themesFor(this.themeCore);

  app.get('/__ui/themes', function(req, res, next) {
    res.set('Content-Type', 'application/json');
    res.json(themes);

    next();
  });
};

function themesFor(themeCore) {
  var appName = themeCore.appName;

  return themeCore.themes.map(function(theme) {
    var allComponentFiles = theme.toJsComponentFilesArray();

    var demoComponentFiles = allComponentFiles.filter(function(componentFile) {
      return /^components\/demo--(.*).js$/.test(componentFile);
    });

    var componentFiles = allComponentFiles.filter(function(componentFile) {
      return /^components\/ui-(.*).js$/.test(componentFile);
    });

    var components = componentFiles.map(function(componentFile) {
      var name = componentNameFor(componentFile);
      var modulePath = modulePathFor(componentFile, appName);
      var kinds = kindsFor(theme, name);
      var demoComponent = demoComponentFor(componentFile, demoComponentFiles);

      return {
        name: name,
        modulePath: modulePath,
        file: componentFile,
        demoFile: demoComponent.file,
        demoComponentName: demoComponent.name,
        kinds: kinds
      };
    });

    return {
      components: components,
      name: theme.name
    };
  });
}

function componentNameFor(componentFile) {
  return componentFile.replace(/^components\/(.*).js$/, '$1');
}

function modulePathFor(componentFile, appName) {
  return componentFile.replace(/^(.*).js/, appName + '/$1');
}

function demoComponentFor(componentFile, demoComponentFiles) {
  var file = demoComponentFiles.find(function(file) {
    return file.replace(/demo--/, '') === componentFile;
  });

  var name = file && file.replace(/^components\/(.*).js$/, '$1');

  return { name: name, file: file };
}

function kindsFor(theme, name) {
  var kindRegExp = new RegExp('^components/' + theme.prefix + '--' + name + '--(?!base|-)(.*).scss$');

  return theme
    .toScssComponentFilesArray()
    .filter((scssFile) => scssFile.match(kindRegExp))
    .map((scssFile) => scssFile.match(kindRegExp)[1]);
}

module.exports = StyleguideServer;
