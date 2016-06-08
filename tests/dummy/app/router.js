import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('index', { path: '/' }, function () {
    this.route('modal');
  });
  this.route('table');
  this.route('panel', function() {
    this.route('inbox');
  });
});

export default Router;
