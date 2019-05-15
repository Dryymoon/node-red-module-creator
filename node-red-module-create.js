#!/usr/bin/env node

const { promisify } = require('util');
const _ = require('lodash');
const replaceInFile = require('replace-in-file');
const fs = require('fs-extra');
const path = require('path');

module.exports = (async function () {

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Prepare readline.question for promisification
  readline.question[promisify.custom] = (question) => {
    return new Promise((resolve) => {
      readline.question(question, resolve);
    });
  };

  const name = await promisify(readline.question)(`Fill name of node-red module: `);

  readline.close();

  if (!name) throw new Error('New module name not provided');

  const moduleName = _.kebabCase(`node-red-contrib-${name}`);

  const moduleFullPath = path.join(process.cwd(), moduleName);

  fs.copySync(path.join(__dirname, 'example-module'), moduleFullPath);

  replaceInFile.sync({
    disableGlobs: true,
    files: path.join(moduleFullPath, 'package.json'),
    from: /node-red-contrib-example-node/g,
    to: moduleName,
  });

  fs.mkdirpSync(path.join(moduleFullPath, 'src'));

  process.chdir(path.join(moduleFullPath, 'src'));

  await require('./node-red-module-create-node');

  process.chdir(path.join(moduleFullPath, '../'));

  console.log('\nModule of node-red created successfuly\n');
  console.log('In feature you can call `npm run create node` or `node-red-ext-create-node` for create additional node, \n'
    + 'and you probably shod locate in src folder with others nodes\n');
  console.log('run `npm install` and next run `npm run dev` for development\n'
    + 'run `npm run build` for build prod version');
})();