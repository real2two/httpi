# @httpi/adapter-hyperexpress

This is a HyperExpress adapter for [@httpi/client](https://github.com/real2two/httpi/tree/main/packages/client).

Install the adapter using one of these:

```bash
npm i @httpi/adapter-hyperexpress
yarn add @httpi/adapter-hyperexpress
pnpm i @httpi/adapter-hyperexpress
```

## Example usage

```js
import HyperExpress from 'hyper-express';
import { createEvents } from '@httpi/client';
import { createHyperExpressAdapter } from '@httpi/adapter-hyperexpress';

const app = new HyperExpress.Server();

app.post(
  '/interactions',
  createHyperExpressAdapter({
    publicKey,
    events: createEvents({
      commands,
      components,
    }),
  }),
);

app.listen(3000);
```
