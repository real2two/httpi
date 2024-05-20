import { Event, type Command, type InteractionRequestDataWithUser } from '../index.js';
import { ApplicationCommandType } from 'discord-api-types/v10';

/**
 * Create a command event
 * @param commands The commands
 * @returns The command event
 */
export function createCommandEvent(commands: Command[]) {
  return new Event({
    execute(data) {
      const command = commands.find(
        (c) =>
          (c.data.type || ApplicationCommandType.ChatInput) === data.interaction.data?.type &&
          c.data.name === data.interaction.data?.name,
      );
      if (!command || !data.user) return;
      return command?.execute?.(data as InteractionRequestDataWithUser);
    },
  });
}
