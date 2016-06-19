import Ember from 'ember';
import layout from '../templates/components/ui-component';

export default Ember.Component.extend({
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

  frame: Ember.computed('uiPrefix', 'kind', function() {
    return `${this.get('uiPrefix')}--${this.get('kind')}`;
  })
});
