import { moduleFor, test } from 'ember-qunit';

moduleFor('service:ui-theme', 'Unit | Service | ui theme');

test('lookup: finds frame component for given `base` & `kind`', function(assert) {
  let service = this.subject();

  let result = service.lookup('ui-foo', 'bar');

  assert.equal(result, 'ui-foo--bar', 'frame component path returned');
});

test('lookup: finds frame component for given `base` & `kind` & `theme`', function(assert) {
  let service = this.subject();

  let result = service.lookup('ui-foo', 'bar', 'mytheme');

  assert.equal(result, 'mytheme--ui-foo--bar', 'theme component path returned');
});

test('register: registers an override for a component', function(assert) {
  let service = this.subject();

  service.register('ui-foo', 'bar', 'mytheme');

  let result = service.lookup('ui-foo', 'bar');

  assert.equal(result, 'mytheme--ui-foo--bar', 'frame component path returned');
});
