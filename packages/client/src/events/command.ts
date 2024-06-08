import { ApplicationCommandType } from 'discord-api-types/v10';
import {
  type Command,
  Event,
  type InteractionEnv,
  type InteractionRequestDataWithUser,
} from '../index.js';

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
