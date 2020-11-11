const path = require('path');
const appRootDir = require('app-root-dir').get();

const configs = {};

require("glob").sync(path.join(appRootDir, './src/**/node-red.json'))
  .forEach(file => {
    // console.log('filePath', file);
    try {
      const config = require(file);
      const { name } = config;
      configs[name] = { ...config, path: path.dirname(file), $file: file };
    } catch (e) {console.error(e);}
  });

module.exports = configs;
