import { Command } from '@httpi/client';
import {
  ApplicationIntegrationType,
  InteractionContextType,
  InteractionResponseType,
} from 'discord-api-types/v10';

export default [
  new Command({
    data: {
      name: 'hello',
      description: 'Hey! This is a test command.',
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
      respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: 'Hello world!',
        },
      });
    },
  }),
];
