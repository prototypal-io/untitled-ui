import UIComponent from './ui-component';
import layout from '../templates/components/ui-table';

export default UIComponent.extend({
  layout,

  activeLayout: 'default',

  sortedData: Ember.computed('data', 'sortBy', function() {
    const sortBy = this.get('sortBy');
    let data = Ember.A(this.get('data'));

    if (sortBy) {
      return data.sortBy(sortBy);
    }

    return data;
  }),

  actions: {
    sortBy(property) {
      if (property) {
        this.set('sortBy', property);
      }
    }
  }
});
