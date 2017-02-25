var Resolver = require('../../../lib/resolver');

QUnit.module('resolver.baseComponentFor');

test('does not resolve for a base component', function () {
  var resolver = new Resolver({
    moduleNamespace: 'modules',
    stylesNamespace: 'styles',
    componentsNamespace: 'components',
    templatesNamespace: 'templates'
  });

  var contexts = {
    'ui-base-theme': {
      name: 'ui-base-theme',
      scss: [
        'modules/ui-base-theme/styles/components/ui-button--base.scss'
      ],
      js: [
        'modules/ui-base-theme/components/ui-kind.js'
      ],
      hbs: [
        'modules/ui-base-theme/templates/components/ui-kind.hbs'
      ]
    }
  };

  var scssFile = 'modules/ui-base-theme/styles/components/ui-button--base.scss';

  var context = contexts['ui-base-theme'];

  equal(resolver.baseComponentFor(scssFile, context, contexts), false, 'resolved to something other than false');
});
