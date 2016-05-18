import Ember from 'ember';
import layout from '../templates/components/ui-input';

export default Ember.Component.extend({
  layout,

  tagName: '',
  kind: 'default',
  disabled: false,

  classes: Ember.computed('kind', 'size', 'error', 'disabled', function() {
    let classes = [
      'ui-input', `ui-input--${this.get('kind')}`,
      `ui-font-size--${this.get('size')}`
    ];

    if (this.get('error')) {
      classes.push('ui-input--error');
    }

    if (this.get('disabled')) {
      classes.push('ui-input--disabled');
    }

    return classes.join(' ');
  })
});
