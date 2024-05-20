# @httpi/adapter-uwebsockets

This is a uWebsockets.js adapter for [@httpi/client](https://github.com/real2two/httpi/tree/main/packages/client).

Install the adapter using one of these:

```bash
npm i @httpi/adapter-uwebsockets
yarn add @httpi/adapter-uwebsockets
pnpm i @httpi/adapter-uwebsockets
```

## Example usage

```js
import uWebSockets from 'uWebSockets.js';
import { createEvents } from '@httpi/client';
import { createUWebsocketsAdapter } from '@httpi/adapter-uwebsockets';

uWebSockets
  .App()
  .post(
    '/interactions',
    createUWebsocketsAdapter({
      publicKey,
      events: createEvents({
        commands,
        components,
      }),
    }),
  )
  .listen(port, (listenSocket) => {
    if (!listenSocket) throw new Error(`Failed to listen port ${port}`);
  });
```
