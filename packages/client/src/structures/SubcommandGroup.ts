import {
  ApplicationCommandOptionType,
  type APIApplicationCommandSubcommandGroupOption,
  type APIApplicationCommandSubcommandOption,
} from 'discord-api-types/v10';

import { Subcommand } from './Subcommand.js';

export class SubcommandGroup extends Subcommand {
  /**
   * Create a subcommand group
   * @param data The subcommand data
   */
  constructor({
    data,
    subcommands,
  }: {
    data: Omit<APIApplicationCommandSubcommandGroupOption, 'type' | 'options'>;
    subcommands: Subcommand[];
  }) {
    const options: APIApplicationCommandSubcommandOption[] = [];
    for (const subcommand of subcommands) {
      options.push(subcommand.data as APIApplicationCommandSubcommandOption);
    }

    super({
      data: {
        ...data,
        type: ApplicationCommandOptionType.SubcommandGroup,
        options,
      },
      autocomplete: (data) => {
        const subcommand = subcommands.find(
          (c) =>
            c.data.type === data.interaction.data?.options?.[0]?.options?.[0]?.type &&
            c.data.name === data.interaction.data?.options?.[0]?.options?.[0]?.name,
        );
        if (!subcommand) {
          return console.warn(
            `Cannot find autocomplete subcommand in subcommand group with type ${data.interaction.data?.options?.[0]?.options?.[0]?.type}: ${data.interaction.data?.options?.[0]?.options?.[0]?.name}`,
          );
        }
        return subcommand?.autocomplete?.(data);
      },
      execute: (data) => {
        const subcommand = subcommands.find(
          (c) =>
            c.data.type === data.interaction.data?.options?.[0]?.options?.[0]?.type &&
            c.data.name === data.interaction.data?.options?.[0]?.options?.[0]?.name,
        );
        if (!subcommand) {
          return console.warn(
            `Cannot find subcommand in subcommand group with type ${data.interaction.data?.options?.[0]?.options?.[0]?.type}: ${data.interaction.data?.options?.[0]?.options?.[0]?.name}`,
          );
        }
        return subcommand?.execute?.(data);
      },
    });
  }
}
