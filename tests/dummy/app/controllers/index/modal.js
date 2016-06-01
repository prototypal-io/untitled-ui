import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    onModalClose() {
      this.transitionToRoute('index');
    }
  }
});
