import { SubcommandGroup } from '@httpi/client';

import helloSubcommand from './group/hello';

export default new SubcommandGroup({
  data: {
    name: 'group',
    description: 'This is a subcommand group',
  },
  subcommands: [helloSubcommand],
});
