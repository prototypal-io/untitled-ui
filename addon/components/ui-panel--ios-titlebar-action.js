import Ember from 'ember';
import layout from '../templates/components/ui-panel--ios-titlebar-action';

export default Ember.Component.extend({
  layout,

  tagName: '',
  location: 'previous',

  isPrevious: Ember.computed.equal('location', 'previous')
});
