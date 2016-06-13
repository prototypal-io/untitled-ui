/*jshint node:true*/
module.exports = {
  description: 'Generate a UI component',

  availableOptions: [
    {
      name: 'path',
      type: String,
      default: 'components'
    }
  ],

  fileMapTokens: function() {
    return this.lookupBlueprint('component').fileMapTokens();
  },

  normalizeEntityName: function(entityName) {
    return this.lookupBlueprint('component').normalizeEntityName(entityName);
  },

  locals: function(options) {
    return this.lookupBlueprint('component').locals(options);
  }
};
