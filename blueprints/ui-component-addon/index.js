/*jshint node:true*/
module.exports = {
  description: 'Generate a UI component-addon',

  fileMapTokens: function() {
    return this.lookupBlueprint('component-addon').fileMapTokens();
  },

  normalizeEntityName: function(entityName) {
    return this.lookupBlueprint('component-addon').normalizeEntityName(entityName);
  },

  locals: function(options) {
    return this.lookupBlueprint('component-addon').locals(options);
  }
};
