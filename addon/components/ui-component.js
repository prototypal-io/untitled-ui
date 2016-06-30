import Ember from 'ember';
import layout from '../templates/components/ui-component';

export default Ember.Component.extend({
  uiTheme: Ember.inject.service(),

  layout,
  tagName: '',

  kind: 'default',
  size: 'medium',

  init() {
    this._super(...arguments);

    this.uiPrefix = this._debugContainerKey.split(':')[1];
  },

  classes: Ember.computed('class', 'size', function() {
    return {
      class: this.get('class'),
      size: `ui-font-size--${this.get('size')}`
    };
  }),

  frame: Ember.computed('uiPrefix', 'kind', 'theme', function() {
    return this.get('uiTheme').lookup(
      this.get('uiPrefix'),
      this.get('kind'),
      this.get('theme')
    );
  })
});
