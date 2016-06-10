import Ember from 'ember';
import ComponentLookupInitializer from 'dummy/initializers/component-lookup';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | component lookup', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  ComponentLookupInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
