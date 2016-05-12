import Ember from 'ember';
import layout from '../templates/components/ui-modal-titlebar';

export default Ember.Component.extend({
  layout,
  tagName: '',

  kind: 'default',

  classes: Ember.computed('kind', function() {
    let classes = [
      'ui-modal-titlebar', `ui-modal-titlebar--${this.get('kind')}`
    ];

    return classes.join(' ');
  }),
});
