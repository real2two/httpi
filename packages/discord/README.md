# @/discord - A simple HTTP interactions library

This is a simple HTTP interactions library for Discord with built-in handlers, which supports TypeScript, CommonJS, and ES Modules.

Quick note: You should be using something else to handle the REST API, such as [`@discordjs/core`](https://github.com/discordjs/discord.js/tree/main/packages/core), since that isn't built-in to this library.

## Create a standalone client

```js
import {
  createEvents,
  createStandaloneClient,
} from "@/discord";

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

## Store an array of commands and components separately

Commands

```ts
import { Command } from "@/discord";

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
import { Component } from "@/discord";

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

## Create commands

```ts
import { createCommands } from "@/discord";

const result = await createCommands({
  id: "discord id here",
  token: "token here",
  // `commands` should be an array of 'Command'/'CommandWithSubcommands'
  commands,
});

console.log(result);
process.exit();
```

## More examples

Not everything in the library is documented in `README.md`.

Here are some useful links that has an example to do something that might've not been mentioned above:

### Client

- [Create a standalone client](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/http/listen.ts)
- [Use the HyperExpress adapter](https://github.com/real2two/http-interactions-template/blob/main/packages/discord/src/utils/createStandaloneClient.ts)
- [Multi-threading (for scaling)](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/http/clusters.ts)

### Commands

- [Create an array of commands](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/utils/commands.ts)
- [Create a chat input command](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/commands/command.ts)
- [Create a command with subcommands](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/commands/subcommand.ts)
- [Create a user command](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/commands/userRightClick.ts)
- [Create a message command](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/commands/messageRightClick.ts)

### Subcommands

- [Create a subcommand without options](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/commands/subcommand/group/hello.ts)
- [Create a subcommand with options](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/commands/subcommand/options.ts)
- [Create a subcommand group](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/commands/subcommand/group.ts)

### Components

- [Create an array of components](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/utils/components.ts)
- [Create a component](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/components/button.ts)

### Utilities (unrelated to the library)

- [Use @discord/core as a REST library](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/utils/rest.ts)
