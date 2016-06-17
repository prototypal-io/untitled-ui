import Ember from 'ember';
import UIComponent from './ui-component';
import layout from '../templates/components/ui-table-row-layout';

export default UIComponent.extend({
  layout,

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
