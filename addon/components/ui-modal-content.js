import Ember from 'ember';
import layout from '../templates/components/ui-modal-content';

export default Ember.Component.extend({
  layout,
  tagName: '',

  kind: 'default',

  classes: Ember.computed('kind', function() {
    let classes = [
      'ui-modal-content', `ui-modal-content--${this.get('kind')}`
    ];

    return classes.join(' ');
  }),
});
