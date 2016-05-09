import Ember from 'ember';
import layout from 'untitled-ui/templates/components/ui-button';
 
export default Ember.Component.extend({
  layout,

  tagName: '',  
  kind: 'default',
  size: 'medium',
  disabled: false,
  loading: false,
  
  isDisabled: Ember.computed.or('disabled', 'loading')
});
