import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    viewInbox() {
      this.transitionToRoute('panel.inbox');
    }
  }
});
