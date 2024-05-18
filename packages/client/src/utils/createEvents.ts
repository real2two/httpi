import { InteractionType } from 'discord-api-types/v10';

import {
  createAutocompleteEvent,
  createCommandEvent,
  createComponentEvent,
  createModalSubmitEvent,
  createPingEvent,
  type Command,
  type Component,
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
}) {
  return {
    [InteractionType.ApplicationCommandAutocomplete]: createAutocompleteEvent(commands),
    [InteractionType.ApplicationCommand]: createCommandEvent(commands),
    [InteractionType.MessageComponent]: createComponentEvent(components),
    [InteractionType.ModalSubmit]: createModalSubmitEvent(components),
    [InteractionType.Ping]: createPingEvent(),
  };
}
