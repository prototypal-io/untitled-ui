import Ember from 'ember';
import layout from '../templates/components/ui-table';

export default Ember.Component.extend({
  layout,

  data: null,
  sortBy: null,

  layouts: Ember.computed(function() {
    return Ember.A([]);
  }),

  containerSize: Ember.computed(function() {
    // TODO needs to bind to the size of the containing element
    return $(window).width();
  }),

  activeBreakpoint: Ember.computed('containerSize', 'layouts.[]', function() {
    const containerSize = this.get('containerSize');
    const layouts = this.get('layouts').sort();

    if (layouts.length && layouts.indexOf('all') === -1) {
      Ember.Logger.warn("No default layout provided for table row.")
    }

    return layouts.find((layout) => {
      return containerSize <= layout;
    }) || 'all';
  }),

  sortedData: Ember.computed('data', function() {
    const sortBy = this.get('sortBy');
    let data = Ember.A(this.get('data'));

    if (sortBy) {
      return data.sortBy(sortBy);
    }

    return data;
  }),

  actions: {
    registerLayout(layout) {
      this.get('layouts').pushObject(layout.get('breakpoint'));
    }
  }
});
