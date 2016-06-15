import Ember from 'ember';
import layout from '../templates/components/ui-tooltip';

export default Ember.Component.extend({
  layout,
  tagName: '',

  kind: 'default',
  size: 'medium',

  showTooltip: false,

  classes: Ember.computed('class', 'size', function() {
    return {
      class: this.get('class'),
      size: `ui-font-size--${this.get('size')}`
    };
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
