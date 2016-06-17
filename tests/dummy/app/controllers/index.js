import Ember from 'ember';

export default Ember.Controller.extend({
  showMessage: true,

  actions: {
    toggleMessage() {
      this.toggleProperty('showMessage');
    },

    save() {
      window.alert('saving');
    }
  }
});
