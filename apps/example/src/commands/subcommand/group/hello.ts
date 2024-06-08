import fs from 'node:fs';
import { Subcommand } from '@httpi/client';
import { InteractionResponseType } from 'discord-api-types/v10';

export default new Subcommand({
  data: {
    name: 'hello',
    description: 'Hey there!',
  },
  execute({ respond }) {
    const image = fs.readFileSync('../../assets/httpi_transparent.png');
    respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: 'Hello world!',
        attachments: [
          {
            name: 'image.png',
            data: image,
          },
        ],
      },
    });
  },
});
