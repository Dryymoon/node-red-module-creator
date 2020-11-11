#!/usr/bin/env node

const webpack = require('webpack');

webpack([
  require('./webpack/webpack-node')(undefined, { mode: 'production' }),
  require('./webpack/webpack-ui')(undefined, { mode: 'production' })
])
  .run((err, stats) => {
    process.stdout.write(stats.toString({
      colors: true    // Shows colors in the console
    }) + '\n');
  });
