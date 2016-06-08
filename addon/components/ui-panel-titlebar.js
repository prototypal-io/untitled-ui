import Ember from 'ember';
import layout from '../templates/components/ui-panel-titlebar';

export default Ember.Component.extend({
  layout,
  tagName: '',

  kind: 'default',

  frame: Ember.computed('kind', function() {
    return `ui-panel-titlebar--${this.get('kind')}`;
  })
});
