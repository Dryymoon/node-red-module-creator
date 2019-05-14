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

  const name = await promisify(readline.question)(`Fill name of node-red node: `);

  readline.close();

  if (!name) throw new Error('New node name not provided');

  const nodeName = _.kebabCase(name);

  const nodeFullPath = path.join(process.cwd(), nodeName);

  fs.copySync(path.join(__dirname, 'example-node'), nodeFullPath);


  replaceInFile.sync({
    disableGlobs: true,
    files: path.join(nodeFullPath, 'node-red.json'),
    from: /example-node/g,
    to: _.kebabCase(name),
  });

  replaceInFile.sync({
    disableGlobs: true,
    files: path.join(nodeFullPath, 'ui.js'),
    from: /example node/g,
    to: name,
  });

  replaceInFile.sync({
    disableGlobs: true,
    files: path.join(nodeFullPath, 'node.js'),
    from: /ExampleNode/,
    to: _.upperFirst(_.camelCase(name)),
  });

//   process.exit(0);

})();