import Ember from 'ember';
import UIKindComponent from './ui-kind';
import layout from '../templates/components/ui-panel--ios-titlebar-action';

export default UIKindComponent.extend({
  layout,

  location: 'previous',

  isPrevious: Ember.computed.equal('location', 'previous')
});
