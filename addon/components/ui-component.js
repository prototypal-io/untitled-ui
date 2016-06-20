import Ember from 'ember';
import layout from '../templates/components/ui-component';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);

    this.uiPrefix = this._debugContainerKey.split(':')[1];
  },

  layout,
  tagName: '',

  kind: 'default',
  size: 'medium',

  classes: Ember.computed('class', 'size', function() {
    return {
      class: this.get('class'),
      size: `ui-font-size--${this.get('size')}`
    };
  }),

  frame: Ember.computed('uiPrefix', 'kind', function() {
    return `${this.get('uiPrefix')}--${this.get('kind')}`;
  })
});
