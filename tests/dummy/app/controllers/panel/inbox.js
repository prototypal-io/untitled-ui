import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    viewIndex() {
      this.transitionToRoute('panel.index');
    }
  }
});
