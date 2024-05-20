import { Command } from './Command.js';
import type { Subcommand } from './Subcommand.js';
import type {
  APIApplicationCommandOption,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord-api-types/v10';

export class CommandWithSubcommands extends Command {
  /**
   * Create a command with subcommands and subcommand groups
   * @param data The command data
   */
  constructor({
    data,
    subcommands,
  }: {
    data: Omit<RESTPostAPIChatInputApplicationCommandsJSONBody, 'options'>;
    subcommands: Subcommand[];
  }) {
    const options: APIApplicationCommandOption[] = [];
    for (const subcommand of subcommands) {
      options.push(subcommand.data);
    }
    (data as RESTPostAPIChatInputApplicationCommandsJSONBody).options = options;

    super({
      data,
      autocomplete: (data) => {
        const subcommand = subcommands.find(
          (c) =>
            c.data.type === data.interaction.data?.options?.[0]?.type &&
            c.data.name === data.interaction.data?.options?.[0]?.name,
        );
        if (!subcommand) return;
        return subcommand?.autocomplete?.(data);
      },
      execute: (data) => {
        const subcommand = subcommands.find(
          (c) =>
            c.data.type === data.interaction.data?.options?.[0]?.type &&
            c.data.name === data.interaction.data?.options?.[0]?.name,
        );
        if (!subcommand) return;
        return subcommand?.execute?.(data);
      },
    });
  }
}
