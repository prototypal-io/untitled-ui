import Ember from 'ember';
import UIComponent from './ui-component';
import layout from '../templates/components/ui-popup';

export default UIComponent.extend({
  layout,

  kind: 'tooltip',

  attachment: 'bottom center',
  targetAttachment: 'top center',
  targetId: null,

  constraints: [{
    to: 'window',
    attachment: 'together'
  }]
});
