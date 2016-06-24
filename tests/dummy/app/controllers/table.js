import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['sortBy'],
  sortBy: 'name',

  data: [
    { 'id': 184583, 'name': 'Jaco Joubert', 'email': 'jaco@example.com' },
    { 'id': 292393, 'name': 'Zach Aysan', 'email': 'aysan-zach@example.com' },
    { 'id': 239374, 'name': 'Erik Bryn', 'email': 'erik@example.com' }
  ]
});
