import env from '@/env';
import { createCommands } from '@httpi/client';
import commands from '../src/utils/commands';

const result = await createCommands({
  id: env.DiscordClientId,
  token: env.DiscordToken,
  commands,
});

console.log(result);
process.exit();
