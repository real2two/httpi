import type { Events } from '@httpi/client';
import uWebSockets from 'uWebSockets.js';
import { createUWebsocketsAdapter } from './createUWebsocketsAdapter';

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
  uWebSockets
    .App()
    .post(
      '/',
      createUWebsocketsAdapter({
        publicKey,
        events,
      }),
    )
    .listen(port, (listenSocket) => {
      if (!listenSocket) throw new Error(`Failed to listen port ${port}`);
    });
}
