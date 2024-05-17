import { Command } from '@/discord';

import {
  ApplicationCommandType,
  ApplicationIntegrationType,
  InteractionContextType,
  InteractionResponseType,
} from 'discord-api-types/v10';

export default new Command({
  data: {
    type: ApplicationCommandType.Message,
    name: 'Message right clicked',
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
  async execute({ respond }) {
    await respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: 'Hello world!',
      },
    });
  },
});
