import { ApplicationCommandType } from 'discord-api-types/v10';

import { Event, type Command, type InteractionRequestDataWithUser } from '../index.js';

/**
 * Create a command event
 * @param commands The commands
 * @returns The command event
 */
export function createCommandEvent(commands: Command[]) {
  return new Event({
    execute: (data) => {
      const command = commands.find(
        (c) =>
          (c.data.type || ApplicationCommandType.ChatInput) === data.interaction.data?.type &&
          c.data.name === data.interaction.data?.name,
      );
      if (!command) {
        return console.warn(
          `Cannot find command with type ${data.interaction.data?.type}: ${data.interaction.data?.name}`,
        );
      }
      if (!data.user) return; // Makes sure 'user' is defined
      return command?.execute?.(data as InteractionRequestDataWithUser);
    },
  });
}
