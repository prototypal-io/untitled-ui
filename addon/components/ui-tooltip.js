import Ember from 'ember';
import UIComponent from './ui-component';
import layout from '../templates/components/ui-tooltip';

export default UIComponent.extend({
  layout,

  showTooltip: false,

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
