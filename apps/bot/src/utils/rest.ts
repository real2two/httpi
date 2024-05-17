import env from '@/env';
import { objectToSnake, objectToCamel } from 'ts-case-convert';
import { API } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { RESTAPIAttachment, Routes } from 'discord-api-types/v10';
import type {
  CamelizedInteraction,
  InteractionUpdateResponse,
  CamelizedRESTPatchAPIWebhookResult,
  InteractionResponseAttachment,
} from '@/discord';

export const rest = new REST({ version: '10' }).setToken(env.DiscordToken);
export const discord = new API(rest);
