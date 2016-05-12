import Ember from 'ember';
import layout from '../templates/components/ui-panel-content';

export default Ember.Component.extend({
  layout,
  tagName: '',

  kind: 'default',

  classes: Ember.computed('kind', function() {
    let classes = [
      'ui-panel-content', `ui-panel-content--${this.get('kind')}`
    ];

    return classes.join(' ');
  })
});
