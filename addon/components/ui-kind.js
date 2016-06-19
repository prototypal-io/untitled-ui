import Ember from 'ember';
import layout from '../templates/components/ui-kind';

export default Ember.Component.extend({
  layout,
  tagName: '',

  init() {
    this._super(...arguments);

    this.uiPrefix = this._debugContainerKey.split(':')[1];
  }
});
