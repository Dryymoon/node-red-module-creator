const getOptions = require('loader-utils').getOptions;

module.exports = function nodeRedUiLoader() {
  const options = getOptions(this) || {};
  if (!options.nodeName) throw new Error('options.nodeName should not be blank for node-red-ui-loader');
  return `
    const node = require('${this.resourcePath}').default || require('${this.resourcePath}');
    RED.nodes.registerType('${options.nodeName}', node);
    console.log('REGISTER - ${options.nodeName}');
  `;
};
