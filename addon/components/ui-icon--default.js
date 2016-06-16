import Ember from 'ember';
import layout from 'untitled-ui/templates/components/ui-icon--default';

export default Ember.Component.extend({
  layout,
  tagName: '',

  symbol: Ember.computed('icon', function() {
    return `icons/icon-${this.get('icon')}`;
  })
});
