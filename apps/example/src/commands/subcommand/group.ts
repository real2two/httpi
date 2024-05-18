import { SubcommandGroup } from '@/discord';

import helloSubcommand from './group/hello';

export default new SubcommandGroup({
  data: {
    name: 'group',
    description: 'This is a subcommand group',
  },
  subcommands: [helloSubcommand],
});
