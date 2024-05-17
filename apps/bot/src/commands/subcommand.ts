import { CommandWithSubcommands } from '@/discord';
import { ApplicationIntegrationType, InteractionContextType } from 'discord-api-types/v10';

import testSubcommand from './subcommand/test';
import groupSubcommand from './subcommand/group';

export default new CommandWithSubcommands({
  data: {
    name: 'subcommand',
    description: 'This is a command with subcommands',
    integration_types: [
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ],
    contexts: [
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ],
  },
  subcommands: [testSubcommand, groupSubcommand],
});
