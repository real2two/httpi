import commands from './commands';
import { Hono } from 'hono';
import { handleHonoRequest } from '@httpi/adapter-hono';
import { createEvents } from '@httpi/client';

type Bindings = {
  DISCORD_CLIENT_ID: string;
  DISCORD_PUBLIC_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', (c) => c.text(`👋 ${c.env.DISCORD_CLIENT_ID}`));

app.post(
  '/',
  async (c) =>
    await handleHonoRequest({
      context: c,
      publicKey: c.env.DISCORD_PUBLIC_KEY,
      events: createEvents({
        commands,
      }),
    }),
);

app.all('*', (c) => c.text('Not found', 404));

const server = { fetch: app.fetch };
export default server;
