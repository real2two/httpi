import { Subcommand } from '@/discord';
import { ApplicationCommandOptionType, InteractionResponseType } from 'discord-api-types/v10';

export default new Subcommand({
  data: {
    name: 'test',
    description: 'This is a test subcommand',
    options: [
      {
        type: ApplicationCommandOptionType.Boolean,
        name: 'value',
        description: 'This is a test boolean',
        required: true,
      },
    ],
  },
  execute: ({ interaction, respond }) => {
    respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `This is a test subcommand. The given value is \`${interaction.data.options[0].options[0].value}\`.`,
      },
    });
  },
});
