import commands from './commands';
import { AutoRouter } from 'itty-router';
import { handleIttyRouterRequest } from '@httpi/adapter-ittyrouter';
import { createEvents } from '@httpi/client';

const router = AutoRouter();

router.get('/', (_request, env) => {
  return new Response(`👋 ${env.DISCORD_CLIENT_ID}`);
});

router.post(
  '/',
  async (request, env) =>
    await handleIttyRouterRequest({
      request,
      env,
      publicKey: env.DISCORD_PUBLIC_KEY,
      events: createEvents({
        commands,
      }),
    }),
);

router.all('*', () => new Response('Not found', { status: 404 }));

const server = { fetch: router.fetch };
export default server;
