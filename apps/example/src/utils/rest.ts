import env from '@/env';
import { API } from '@discordjs/core';
import { REST } from '@discordjs/rest';

export const rest = new REST({ version: '10' }).setToken(env.DiscordToken);
export const discord = new API(rest);
