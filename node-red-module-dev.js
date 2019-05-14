#!/usr/bin/env node

const appRootDir = require('app-root-dir').get();
const webpack = require('webpack');
const path = require('path');
const which = require('which');
const nodemon = require('nodemon');

const watchingNode = webpack([
  require('./webpack/webpack-node')(),
  require('./webpack/webpack-ui')()
])
  .watch({}, (err, stats) => {
    process.stdout.write(stats.toString({
      colors: true    // Shows colors in the console
    }) + '\n');
  });

const nodeRedBin = which.sync('node-red', {nothrow: true});
console.log('nodeRedBin', path.join(appRootDir, 'node_modules/.node-red/nodes'));

if(nodeRedBin) {
  nodemon({
    delay: 1000,
    // watch: [path.join(appRootDir, 'node_modules/.node-red/nodes')],
    ignoreRoot: [],
    watch: ['node_modules/.node-red/nodes'],
    ext: 'js,html',
    exec: `${nodeRedBin} --userDir ./node_modules/.node-red`,
    verbose: true
  });

  nodemon.on('start', function () {
    console.log('App has started');
  }).on('quit', function () {
    console.log('App has quit');
  }).on('restart', function (files) {
    console.log('App restarted due to: ', files);
  });
}