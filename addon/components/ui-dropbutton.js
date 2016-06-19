import Ember from 'ember';
import UIComponent from './ui-component';
import layout from 'untitled-ui/templates/components/ui-dropbutton';

export default UIComponent.extend({
  layout,

  disabled: false,
  loading: false,
  showPopup: false,

  isDisabled: Ember.computed.or('disabled', 'loading'),

  states: Ember.computed('isDisabled', 'loading', 'showPopup', function() {
    return {
      disabled: this.get('isDisabled'),
      loading: this.get('loading'),
      active: this.get('showPopup')
    }
  }),

  targetId: Ember.computed(function() {
    return `${Ember.guidFor(this)}--target`;
  }),

  actions: {
    showPopup() {
      this.set('showPopup', true);
    },

    hidePopup() {
      this.set('showPopup', false);
    },

    togglePopup() {
      this.toggleProperty('showPopup');
    }
  }
});
