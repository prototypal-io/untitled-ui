import Ember from 'ember';
import layout from '../templates/components/ui-table-column';

export default Ember.Component.extend({
  layout,
  tagName: '',

  flex: 1,
  sortable: false
});
