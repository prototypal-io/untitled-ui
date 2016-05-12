import Ember from 'ember';
import layout from '../templates/components/ui-panel';

export default Ember.Component.extend({
  layout,
  tagName: '',

  kind: 'default',
  size: 'medium',

  classes: Ember.computed('kind', 'size', function() {
    let classes = [
      'ui-panel', `ui-panel--${this.get('kind')}`,
      `ui-fontSize--${this.get('size')}`
    ];

    return classes.join(' ');
  })
});
