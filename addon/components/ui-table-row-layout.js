import Ember from 'ember';
import layout from '../templates/components/ui-table-row-layout';

export default Ember.Component.extend({
  layout,
  tagName: '',

  breakpoint: 'all',

  didInsertElement() {
    Ember.run.next(this, function() {
      this.attrs.register(this);
    });
  },

  activeBreakpoint: null,

  isActiveBreakpoint: Ember.computed('breakpoint', 'activeBreakpoint', function() {
    return this.get('breakpoint') === this.get('activeBreakpoint');
  })
});
