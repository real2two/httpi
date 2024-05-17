import { Subcommand } from '@/discord';
import { ApplicationCommandOptionType, InteractionResponseType } from 'discord-api-types/v10';

export default new Subcommand({
  data: {
    name: 'options',
    description: 'This is a test subcommand with options',
    options: [
      {
        type: ApplicationCommandOptionType.String,
        name: 'value',
        description: 'This is a test value',
        required: true,
        autocomplete: true,
      },
    ],
  },
  autocomplete({ interaction, respond }) {
    const value = interaction.data.options[0].options[0].value;
    console.log('Autocomplete value', value);

    respond({
      type: InteractionResponseType.ApplicationCommandAutocompleteResult,
      data: {
        choices: [
          {
            name: 'option1',
            value: 'option1',
          },
          {
            name: 'option2',
            value: 'option2',
          },
        ],
      },
    });
  },
  execute({ interaction, respond }) {
    const value = interaction.data.options[0].options[0].value;
    console.log('Command value', value);

    respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `This is a test subcommand. The given value is \`${value}\`.`,
      },
    });
  },
});
