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

export async function editMessage(
  interaction: CamelizedInteraction,
  message: InteractionUpdateResponse,
) {
  if (message?.attachments) {
    // Create attachments variable
    const attachments = message?.attachments as InteractionResponseAttachment[];
    // Create an updated message attachments object
    const messageAttachments: RESTAPIAttachment[] = [];
    for (let id = 0; id < message.attachments.length; ++id) {
      messageAttachments.push({
        id,
        filename: message.attachments[id].name,
      });
    }
    // Create attachment response
    return objectToCamel(
      (await rest.patch(Routes.webhookMessage(interaction.applicationId, interaction.token), {
        body: {
          ...objectToSnake(message),
          attachments: messageAttachments,
        },
        files: attachments,
      })) as Promise<CamelizedRESTPatchAPIWebhookResult>,
    );
  } else {
    // Create normal response
    return objectToCamel(
      (await rest.patch(Routes.webhookMessage(interaction.applicationId, interaction.token), {
        body: objectToSnake(message),
      })) as Promise<CamelizedRESTPatchAPIWebhookResult>,
    );
  }
}
