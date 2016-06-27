import Ember from 'ember';
import layout from '../templates/components/ui-table-layout';

export default Ember.Component.extend({
  layout,
  tagName: '',

  breakpoint: 'all',

  isActiveBreakpoint: Ember.computed('breakpoint', 'activeBreakpoint', function() {
    return this.get('breakpoint') === this.get('activeBreakpoint');
  })
});
