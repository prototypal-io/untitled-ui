import Ember from 'ember';
import UIComponent from './ui-component';
import layout from '../templates/components/ui-table-column';

export default UIComponent.extend({
  layout,

  flex: 1,
  sortable: false
});
