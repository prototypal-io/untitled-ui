import Ember from 'ember';
import layout from 'untitled-ui/templates/components/ui-button';

export default Ember.Component.extend({
  layout,

  tagName: '',
  kind: 'default',
  size: 'medium',
  disabled: false,
  loading: false,

  isDisabled: Ember.computed.or('disabled', 'loading'),

  classes: Ember.computed('size', 'kind', 'loading', function() {
    let classes = [
      'ui-button', `ui-button--${this.get('kind')}`,
      `ui-fontSize--${this.get('size')}`
    ];

    if (this.get('isDisabled')) {
      classes.push('ui-button--disabled');
    }

    if (this.get('loading')) {
      classes.push('ui-button--loading');
    }

    return classes.join(' ');
  }),

  actions: {
    onclick(event) {
      this.sendAction('onclick');
    }
  }
});
