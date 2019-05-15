import { Node } from 'node-red-module-creator';

export default class ExampleNode extends Node {
  constructor(config) {
    super(config);

    // get data from config
    const { name } = config;

    this.on('input', async (msg) => {
      try {
        // Do some work

        this.send(msg);
      } catch (e) {
        this.error(`Error: ${e.toString()}`, msg);
      }
    });
  }
}
