import Ember from 'ember';
<%= importTemplate %>
export default Ember.Component.extend({<%= contents %>,
  tagName: '',

  disabled: false,
  kind: 'default',
  size: 'medium',

  classes: Ember.computed('class', 'size', function() {
    return {
      class: this.get('class'),
      size: `ui-font-size--${this.get('size')}`
    }
  }),

  frame: Ember.computed('kind', function() {
    return `<%= dasherizedModuleName %>--${this.get('kind')}`;
  })
});
