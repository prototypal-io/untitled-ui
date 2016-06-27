import UIComponent from './ui-component';
import layout from '../templates/components/ui-table';

export default UIComponent.extend({
  layout,

  didInsertElement() {
    this._updateContainerSize = Ember.run.bind(this, this.updateContainerSize);
    Ember.$(window).on('resize', this._updateContainerSize);
    Ember.run.next(this, this.updateContainerSize);
  },

  willDestroyElement() {
    Ember.$(window).off('resize', this._updateContainerSize);
  },

  containerSize: null,

  activeBreakpoint: Ember.computed('containerSize', 'breakpoints', function() {
    const containerSize = this.get('containerSize');
    const breakpoints = this.get('breakpoints').sort();

    if (breakpoints.length && breakpoints.indexOf('all') === -1) {
      Ember.Logger.warn("No default layout provided for table row.")
    }

    return breakpoints.find((breakpoint) => {
      return containerSize <= breakpoint;
    }) || 'all';
  }),

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
  },

  updateContainerSize() {
    this.set('containerSize', $(window).width());
  }
});
