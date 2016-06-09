import Ember from 'ember';
import layout from '../templates/components/ui-tooltip';

export default Ember.Component.extend({
  layout,
  tagName: '',

  kind: 'default',
  size: 'medium',

  constraints: [{
    to: 'scrollParent',
    attachment: 'together'
  }],

  targetAttachment: 'top center',
  attachment: 'bottom center',

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
    }
  }
});
