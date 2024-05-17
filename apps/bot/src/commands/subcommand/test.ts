import { Subcommand } from '@/discord';
import { InteractionResponseType } from 'discord-api-types/v10';

export default new Subcommand({
  data: {
    name: 'test',
    description: 'This is a test subcommand',
  },
  execute: ({ respond }) => {
    respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: 'This is a test subcommand',
      },
    });
  },
});
