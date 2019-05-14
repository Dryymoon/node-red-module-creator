// import { promisify } from 'util';
import { RED } from '../webpack/helpers/red-global-context';

export default class RedNodeBase {
  constructor(config) {
    RED.nodes.createNode(this, config);
    // this.config = config;
  }

  /* get nodeContext() {
   return {
   get(key) {
   if (!key) return;
   return promisify(super.context().get)
   },
   set(key, value) {

   },
   delete() {},
   };
   // return super.context()
   }

   get flowContext() {
   return super.context().flow;
   }

   get globalContext() {
   return super.context().global;
   } */
}
