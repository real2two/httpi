import env from '@/env';
import commands from '../src/utils/commands';
import { createCommands } from '@httpi/client';

const result = await createCommands({
  id: env.DiscordClientId,
  token: env.DiscordToken,
  commands,
});

console.log(result);
process.exit();
