const path = require('path');
const getOptions = require('loader-utils').getOptions;

module.exports = function nodeRedUiLoader() {
  const options = getOptions(this) || {};
  if (!options.nodeName) throw new Error('options.nodeName should not be blank for node-red-ui-loader');

  const redGlobalContextFile = require('slash')(path.join(__dirname, '../helpers/red-global-context.js'));

  return `
    // require('source-map-support').install();
    module.exports = function(RED) {
      require('${redGlobalContextFile}').RED = RED;
      var nodeModule = require('${require('slash')(this.resourcePath)}');
      nodeModule = nodeModule.default || nodeModule;
      RED.nodes.registerType('${options.nodeName}', nodeModule);
      console.log('REGISTER - ${options.nodeName}');
    }
  `;
};
