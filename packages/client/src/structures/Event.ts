import type { InteractionRequest } from '../index.js';

export class Event {
  execute: InteractionRequest;
  /**
   * Create a event
   * @param data The event data
   */
  constructor({ execute }: { execute: InteractionRequest }) {
    this.execute = execute;
  }
}
