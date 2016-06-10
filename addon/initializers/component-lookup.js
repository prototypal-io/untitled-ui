const {
  ComponentLookup
} = Ember;

const UI_COMPONENT_PATTERN = /^(ui-.*)--/;

function isUIComponentKind(name) {
  return UI_COMPONENT_PATTERN.test(name);
}

function defaultUIComponentKindFor(name) {
  let componentName = name.match(UI_COMPONENT_PATTERN)[1];
  return `component:${componentName}--default`;
}

ComponentLookup.reopen({
  componentFor(name, owner) {
    if (isUIComponentKind(name)) {
      let lookupPath = `component:${name}`;

      if (!owner.hasRegistration(lookupPath)) {
        let defaultUIKindPath = defaultUIComponentKindFor(name);
        let Factory = owner._lookupFactory(defaultUIKindPath);

        owner.register(lookupPath, Factory.extend({
          prefix: 'ui-button--shadow'
        }));
      }
    }

    return this._super(...arguments);
  }
});

function initialize() {
}

export default {
  name: 'component-lookup',
  initialize
};
