import Ember from 'ember';
import layout from '../templates/components/ui-panel-titlebar';

export default Ember.Component.extend({
  layout,
  tagName: '',

  kind: 'default',

  classes: Ember.computed('kind', function() {
    let classes = [
      'ui-panel-titlebar', `ui-panel-titlebar--${this.get('kind')}`
    ];

    return classes.join(' ');
  })
});
