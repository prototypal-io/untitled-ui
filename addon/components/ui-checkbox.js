import Ember from 'ember';
import layout from '../templates/components/ui-checkbox';

export default Ember.Component.extend({
  layout,

  tagName: '',
  kind: 'default',
  disabled: false,

  classes: Ember.computed('kind', 'size', 'error', 'disabled', 'value', function() {
    let classes = [
      'ui-checkbox', `ui-checkbox--${this.get('kind')}`,
      `ui-fontSize--${this.get('size')}`
    ];

    if (this.get('error')) {
      classes.push('ui-checkbox--error');
    }

    if (this.get('disabled')) {
      classes.push('ui-checkbox--disabled');
    } else {
      classes.push('ui-checkbox--enabled');
    }

    if (this.get('value')) {
      classes.push('ui-checkbox--checked');
    }

    return classes.join(' ');
  })
});
