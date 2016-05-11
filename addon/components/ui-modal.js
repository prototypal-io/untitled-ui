import Ember from 'ember';
import layout from '../templates/components/ui-modal';

export default Ember.Component.extend({
  layout,
  
  actions: {
    dismiss() {
      this.sendAction('onclose');
    }
  }
});
