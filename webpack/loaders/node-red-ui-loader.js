const path = require('path');

module.exports = async function nodeRedUiLoader(content) {
  this.async();

  const { name, ui } = JSON.parse(content);

  const uiJsFilePath = require('slash')(path.join(this.context, ui))

  this.callback(null,
    `
    const node = require('${uiJsFilePath}').default || require('${uiJsFilePath}');
    RED.nodes.registerType('${name}', node);
    console.log('REGISTER - ${name}');
    `
  );
};


/*
const getOptions = require('loader-utils').getOptions;

const loadModuleAsync = (resourcePath) => new Promise((resolve, reject) => this.loadModule(resourcePath, (err, source, sourceMap, module) => {
  if (err) return reject(err);
  resolve({ source, sourceMap, module });
})); */


