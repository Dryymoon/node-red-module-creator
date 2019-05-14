const path = require('path');
const appRootDir = require('app-root-dir').get();

module.exports = function (env ={}, { mode = 'development' } = {}) {

  const PROD = mode === 'production';

  const babelConfig = {};
  babelConfig.presets = [];
  babelConfig.presets.push([require.resolve("@babel/preset-env"), {
    modules: false,
    shippedProposals: true, // to support spread operators
    targets: { browsers: "> 0.25%, not dead" }
  }]);
  babelConfig.plugins = [];

  babelConfig.plugins.push(require.resolve("@babel/plugin-proposal-optional-catch-binding"));
  babelConfig.plugins.push(require.resolve("@babel/plugin-proposal-class-properties"));

  const config = {};

  config.mode = PROD ? 'production' : 'development';
  config.devtool = false;
  config.target = 'web';

  config.stats = "minimal";

  const redNodesConfigs = require('./get-node-red-configs');

  config.entry = require('lodash/mapValues')(require('./get-node-red-configs'),
    ({ path: p, ui }, name) => `node-red-ui-loader?nodeName=${name}!${path.join(p, ui)}`
  );

  config.output = {};
  config.output.path = PROD ? path.join(appRootDir, './dist') : path.join(appRootDir, './node_modules/.node-red/nodes');

  const filename = '[name].[ext]';

  config.output.filename = '[name].js';

  config.resolveLoader = { alias: {}, modules: [] };
  config.resolveLoader.alias['node-red-ui-loader'] = path.join(__dirname, "./loaders/node-red-ui-loader");
  config.resolveLoader.modules.push(path.join(appRootDir, './node_modules/'));
  config.resolveLoader.modules.push(path.join(__dirname, '../node_modules/'));

  config.module = { rules: [] };

  config.module.rules.push({
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    use: ['babel-loader?' + JSON.stringify({ ...babelConfig, babelrc: false })],
  });

  config.module.rules.push({
    test: /\.html/,
    exclude: /(node_modules|bower_components)/,
    use: [
      {
        loader: 'html-loader',
        options: {
          minimize: false,
          removeComments: true,
          collapseWhitespace: true,
          interpolate: true
        }
      }],
  });

  config.module.rules.push({
    type: 'javascript/auto',
    test: /node-red\.json/,
    use: [
      'node-red-ui-loader'
    ],
  });

  config.module.rules.push({
    test: /\.(jpe?g|png|gif)$/,
    use: [{
      loader: 'file-loader',
      options: {
        publicPath: (url, resourcePath, context) => {
          return `${url}`;
        },
        outputPath: 'icons',
        name: '[name].[ext]'
      }
    }]
  });

  config.plugins = [];

  require('lodash/values')(redNodesConfigs).forEach(({ name, path: p, editor, help }) => {
    config.plugins.push(new (require('html-webpack-plugin'))({
      filename: `${name}.html`,
      template: [
        'html-loader?interpolate=true&minimize=false',
        `ejs-html-loader?${JSON.stringify({
          name,
          editor: path.join(p, editor || 'editor.html'),
          help: path.join(p, help || 'help.html'),
        })}`,
        path.join(__dirname, 'html-template.ejs')
      ].join('!'),
      inject: true,
      minify: true,
      chunks: [name],
      inlineSource: '.(js)$'
    }));
    config.plugins.push(new (require('no-emit-webpack-plugin'))(`${name}.js`));
  });

  config.plugins.push(new (require('html-webpack-inline-source-plugin'))());

  return config;
};

// module.exports = config;