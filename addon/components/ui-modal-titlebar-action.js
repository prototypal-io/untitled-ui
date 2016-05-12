import Ember from 'ember';
import layout from '../templates/components/ui-modal-titlebar';

export default Ember.Component.extend({
  layout,
  tagName: '',

  kind: 'left',

  classes: Ember.computed('kind', function() {
    let classes = [
      'ui-modal-titlebar-action', `ui-modal-titlebar-action--${this.get('kind')}`
    ];

    return classes.join(' ');
  }),
});
