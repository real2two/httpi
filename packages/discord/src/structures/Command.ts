import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import type { InteractionRequestWithUser } from '../';

export class Command {
  data: RESTPostAPIApplicationCommandsJSONBody;
  autocomplete?: InteractionRequestWithUser;
  execute?: InteractionRequestWithUser;
  /**
   * Create a command
   * @param data The command data
   */
  constructor({
    data,
    autocomplete,
    execute,
  }: {
    data: RESTPostAPIApplicationCommandsJSONBody;
    autocomplete?: InteractionRequestWithUser;
    execute?: InteractionRequestWithUser;
  }) {
    this.data = data;
    this.autocomplete = autocomplete;
    this.execute = execute;
  }
}
