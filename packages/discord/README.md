# @/discord - A simple HTTP interactions library

This is a simple HTTP interactions library I created, because I don't really like the other ones.

This supports TypeScript, CommonJS, and ES Modules.

I tried to make it pretty simple as well, and you should be using something else to use the REST API, such as [`@discordjs/core`](https://github.com/discordjs/discord.js/tree/main/packages/core).

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

Here are some useful links that has an example of how to do something that might've not been mentioned above:

### Client

- [Create standalone client](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/http/listen.ts)
- [Example of how to use the HyperExpress adapater](https://github.com/real2two/http-interactions-template/blob/main/packages/discord/src/utils/createStandaloneClient.ts)
- [Multi-threading (to scaling)](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/http/clusters.ts)

### Commands

- [Create an array of commands](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/utils/commands.ts)
- [Create chat input command](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/commands/command.ts)
- [Create user command](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/commands/userRightClick.ts)
- [Create message command](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/commands/messageRightClick.ts)

### Subcommands

- [Create command with subcommands](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/commands/subcommand.ts)
- [Create subcommand without options](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/commands/subcommand/group/hello.ts)
- [Create subcommand with options](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/commands/subcommand/options.ts)
- [Create subcommand group](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/commands/subcommand/group.ts)

### Components

- [Create an array of components](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/utils/components.ts)
- [Create component](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/components/button.ts)

### Utilities (unrelated to the library)

- [Use @discord/core as a REST library](https://github.com/real2two/http-interactions-template/blob/main/apps/example/src/utils/rest.ts)
