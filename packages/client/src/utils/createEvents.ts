import { InteractionType } from 'discord-api-types/v10';

import {
  type Command,
  type Component,
  type Events,
  createAutocompleteEvent,
  createCommandEvent,
  createComponentEvent,
  createModalSubmitEvent,
  createPingEvent,
} from '../index.js';

/**
 * Create all of the events
 * @param data The commands and components
 * @returns The events
 */
export function createEvents({
  commands = [],
  components = [],
}: {
  commands: Command[];
  components: Component[];
}): Events {
  return {
    [InteractionType.ApplicationCommandAutocomplete]: createAutocompleteEvent(commands),
    [InteractionType.ApplicationCommand]: createCommandEvent(commands),
    [InteractionType.MessageComponent]: createComponentEvent(components),
    [InteractionType.ModalSubmit]: createModalSubmitEvent(components),
    [InteractionType.Ping]: createPingEvent(),
  };
}
