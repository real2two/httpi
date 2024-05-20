import env from '@/env';
import { createEvents } from '@httpi/client';
import { createStandaloneClient } from '@httpi/adapter-uwebsockets';

import commands from '../utils/commands';
import components from '../utils/components';

createStandaloneClient({
  port: env.WebsitePort,
  publicKey: env.DiscordPublicKey,
  events: createEvents({
    commands,
    components,
  }),
});
