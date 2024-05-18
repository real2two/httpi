import HyperExpress from 'hyper-express';
import { createHyperExpressAdapter } from './adapter';
import type { Events } from '@httpi/client';

/**
 * Start the bot using a standalone web server
 * @param data The client data
 */
export function createStandaloneClient({
  port,
  publicKey,
  events,
}: {
  port: number;
  publicKey: string;
  events: Events;
}) {
  const app = new HyperExpress.Server();

  app.post(
    '/interactions',
    createHyperExpressAdapter({
      publicKey,
      events,
    }),
  );

  app.listen(port);
}
