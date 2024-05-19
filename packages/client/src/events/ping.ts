import { InteractionResponseType } from 'discord-api-types/v10';

import { Event } from '../index.js';

/**
 * Create a ping event
 * @returns The ping event
 */
export function createPingEvent() {
  return new Event({
    execute: ({ respond }) => {
      return respond({
        type: InteractionResponseType.Pong,
      });
    },
  });
}
