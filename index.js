/* jshint node: true */
'use strict';

module.exports = {
  name: 'untitled-ui',
  
  included: function(app) {
    this._super.included(app);

    app.import('vendor/normalize.css');
  }
};
