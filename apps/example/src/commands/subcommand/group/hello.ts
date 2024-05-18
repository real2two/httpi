import { Subcommand } from '@httpi/client';
import { InteractionResponseType } from 'discord-api-types/v10';

export default new Subcommand({
  data: {
    name: 'hello',
    description: 'Hey there!',
  },
  execute({ respond }) {
    respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: 'Hello world!',
      },
    });
  },
});
