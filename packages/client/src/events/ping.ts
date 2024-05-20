import { Event } from '../index.js';
import { InteractionResponseType } from 'discord-api-types/v10';

/**
 * Create a ping event
 * @returns The ping event
 */
export function createPingEvent() {
  return new Event({
    execute({ respond }) {
      return respond({
        type: InteractionResponseType.Pong,
      });
    },
  });
}
