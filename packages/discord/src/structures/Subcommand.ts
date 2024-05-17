import {
  APIApplicationCommandSubcommandOption,
  APIApplicationCommandSubcommandGroupOption,
  ApplicationCommandOptionType,
} from 'discord-api-types/v10';
import type { InteractionRequestWithUser } from '../index.js';

export class Subcommand {
  data: APIApplicationCommandSubcommandOption | APIApplicationCommandSubcommandGroupOption;
  autocomplete?: InteractionRequestWithUser;
  execute?: InteractionRequestWithUser;
  /**
   * Create a subcommand
   * @param data The subcommand data
   */
  constructor({
    data,
    autocomplete,
    execute,
  }: {
    data:
      | Omit<APIApplicationCommandSubcommandOption, 'type'>
      | APIApplicationCommandSubcommandGroupOption;
    autocomplete?: InteractionRequestWithUser;
    execute?: InteractionRequestWithUser;
  }) {
    this.data = {
      type: ApplicationCommandOptionType.Subcommand,
      ...data,
    };
    this.autocomplete = autocomplete;
    this.execute = execute;
  }
}
