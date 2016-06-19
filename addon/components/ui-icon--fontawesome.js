import Ember from 'ember';
import layout from 'untitled-ui/templates/components/ui-icon--fontawesome';

const TYPE_SCALE = ['x-small', 'small', 'medium', 'large', 'x-large'];

export default Ember.Component.extend({
  layout,
  tagName: '',

  fontAwesomeSize: Ember.computed('size', function() {
    const size = this.get('size');

    if (TYPE_SCALE.indexOf(size) !== -1) {
      return 'fa-lg';

    } else {
      return size;
    }
  })
});
