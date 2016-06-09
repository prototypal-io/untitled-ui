import Ember from 'ember';
import layout from '../templates/components/ui-tooltip';

export default Ember.Component.extend({
  layout,
  tagName: '',

  kind: 'default',
  size: 'medium',

  showTooltip: false,

  sizeClass: Ember.computed('size', function() {
    return `ui-font-size--${this.get('size')}`;
  }),

  frame: Ember.computed('kind', function() {
    return `ui-tooltip--${this.get('kind')}`;
  }),

  targetId: Ember.computed(function() {
    return `${Ember.guidFor(this)}--target`;
  }),

  actions: {
    show() {
      this.set('showTooltip', true);
    },

    hide() {
      this.set('showTooltip', false);
    },

    toggle() {
      this.toggleProperty('showTooltip');
    }
  }
});
