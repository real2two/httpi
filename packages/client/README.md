# ![httpi logo](../../assets/httpi_transparent.svg)

## @httpi/client

A type-safe and performant HTTP interactions library for Discord with built-in handlers for TypeScript and JavaScript developers.

Discord server: [https://discord.gg/gazktH5y3e](https://discord.gg/gazktH5y3e)

Install using:

```bash
# npm
npm i @httpi/client
npm i @httpi/adapter-hyperexpress

# yarn
yarn add @httpi/client
yarn add @httpi/adapter-hyperexpress

# pnpm
pnpm i @httpi/client
pnpm i @httpi/adapter-hyperexpress
```

### Create a standalone client

```js
import { createEvents } from '@httpi/client';
import { createStandaloneClient } from '@httpi/adapter-hyperexpress';

// Under "INTERACTIONS ENDPOINT URL" on https://discord.dev, add your link.

createStandaloneClient({
  port: 3000,
  publicKey: "public key here",
  events: createEvents({
    // `commands` should be an array of 'Command'/'CommandWithSubcommands'
    // `components` should be an array of 'Component'
    commands,
    components,
  }),
});
```

### Store an array of commands and components separately

Commands

```ts
import { Command } from "@httpi/client";

const helpCommand = new Command({
  data: {
    name: "help",
    description: "This is a help command",
  },
  execute({ respond }) {
    respond({
      type: 4, // ChannelMessageWithSource
      data: {
        content: "Hello world!",
      },
    });
  },
});

export const commands = [
  helpCommand,
];
```

Components

```ts
import { Component } from "@httpi/client";

const buttonComponent = new Component({
  customId: /^button$/,
  execute({ respond }) {
    return respond({
      type: 4, // ChannelMessageWithSource
      data: {
        content: "Hello world!",
      },
    });
  },
});

export const components = [
  buttonComponent,
];
```

### Create commands

```ts
import { createCommands } from "@httpi/client";

const result = await createCommands({
  id: "discord id here",
  token: "token here",
  // `commands` should be an array of 'Command'/'CommandWithSubcommands'
  commands,
});

console.log(result);
process.exit();
```

### Adapters

If you want to use this library with another HTTP server library, you can use one of these adapters:

- [HyperExpress adapter by real2two](https://github.com/real2two/httpi/tree/main/packages/adapter-hyperexpress)
- [Hono adapter by real2two](https://github.com/real2two/httpi/tree/main/packages/adapter-hono)
- [itty-router adapter by real2two](https://github.com/real2two/httpi/tree/main/packages/adapter-ittyrouter)
- [ElysiaJS adapter by desplmfao](https://github.com/desplmfao/httpi-elysia-adapter)

### More examples

Not everything in the library is documented in `README.md`.

Here are some useful links that has an example to do something that might've not been mentioned above:

#### Client

- [Create a standalone client](https://github.com/real2two/httpi/blob/main/apps/example/src/http/listen.ts)
- [Multi-threading (for scaling)](https://github.com/real2two/httpi/blob/main/apps/example/src/http/clusters.ts)

#### Commands

- [Create an array of commands](https://github.com/real2two/httpi/blob/main/apps/example/src/utils/commands.ts)
- [Create a chat input command](https://github.com/real2two/httpi/blob/main/apps/example/src/commands/command.ts)
- [Create a command with subcommands](https://github.com/real2two/httpi/blob/main/apps/example/src/commands/subcommand.ts)
- [Create a user command](https://github.com/real2two/httpi/blob/main/apps/example/src/commands/userRightClick.ts)
- [Create a message command](https://github.com/real2two/httpi/blob/main/apps/example/src/commands/messageRightClick.ts)

#### Subcommands

- [Create a subcommand without options](https://github.com/real2two/httpi/blob/main/apps/example/src/commands/subcommand/group/hello.ts)
- [Create a subcommand with options](https://github.com/real2two/httpi/blob/main/apps/example/src/commands/subcommand/options.ts)
- [Create a subcommand group](https://github.com/real2two/httpi/blob/main/apps/example/src/commands/subcommand/group.ts)

#### Components

- [Create an array of components](https://github.com/real2two/httpi/blob/main/apps/example/src/utils/components.ts)
- [Create a component](https://github.com/real2two/httpi/blob/main/apps/example/src/components/button.ts)

#### Utilities (unrelated to the library)

- [Use @discord/core as a REST library](https://github.com/real2two/httpi/blob/main/apps/example/src/utils/rest.ts)
