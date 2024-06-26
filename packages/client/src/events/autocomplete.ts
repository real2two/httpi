import { ApplicationCommandType } from 'discord-api-types/v10';
import { type Command, Event, type InteractionRequestDataWithUser } from '../index.js';

/**
 * Create an autocomplete event
 * @param commands The commands
 * @returns The autocomplete event
 */
export function createAutocompleteEvent(commands: Command[]) {
  return new Event({
    execute(data) {
      const command = commands.find(
        (c) =>
          (c.data.type || ApplicationCommandType.ChatInput) === data.interaction.data?.type &&
          c.data.name === data.interaction.data?.name,
      );
      if (!command || !data.user) return;
      return command?.autocomplete?.(data as InteractionRequestDataWithUser);
    },
  });
}
