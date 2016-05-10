import Ember from 'ember';
import layout from '../templates/components/ui-input';

export default Ember.Component.extend({
  layout,
  
  tagName: '',
  
  classes: Ember.computed('class', 'error', function() {
    let classes = ['ui-input'];

    let error = this.get('error');
    if (error) { classes.push('ui-input--error'); }

    let providedClass = this.get('class');
    if (providedClass) { classes.push(providedClass); }
    return classes;
  })
});
