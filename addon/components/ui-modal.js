import Ember from 'ember';
import layout from '../templates/components/ui-modal';

export default Ember.Component.extend({
  layout,

  attributeBindings: ['tabindex'],

  // Allows modal to reveive focus so we can catch key presses
  tabindex: 0,

  didInsertElement() {
    this.$().focus();
  },

  keyUp(event) {
    // ESC
    if (event.which === 27) {
      this.sendAction('onclose');
    }
  },

  actions: {
    dismiss() {
      this.sendAction('onclose');
    }
  }
});
