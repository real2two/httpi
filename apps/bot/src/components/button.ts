import { Component } from '@/discord';
import { InteractionResponseType, MessageFlags } from 'discord-api-types/v10';

export default new Component({
  customId: /^button$/,
  execute: async ({ respond }) => {
    return respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: 'This is a button template file',
        flags: MessageFlags.Ephemeral,
      },
    });
  },
});
