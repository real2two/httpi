import type {
  APIBaseInteraction,
  InteractionType,
  APIInteractionResponseCallbackData,
  APIApplicationCommandAutocompleteResponse,
  APIInteractionResponseChannelMessageWithSource,
  APIInteractionResponseDeferredChannelMessageWithSource,
  APIInteractionResponseDeferredMessageUpdate,
  APIInteractionResponsePong,
  APIInteractionResponseUpdateMessage,
  APIModalInteractionResponse,
  APIPremiumRequiredInteractionResponse,
  APIUser,
  APIGuildMember,
  RESTPatchAPIWebhookResult,
} from 'discord-api-types/v10';
import type { ObjectToCamel } from 'ts-case-convert/lib/caseConvert';
import type { InteractionResponseAttachment } from './interaction';

export type CamelizedRESTPatchAPIWebhookResult = ObjectToCamel<RESTPatchAPIWebhookResult>;

export type CustomAPIInteractionResponse =
  | APIApplicationCommandAutocompleteResponse
  | CustomAPIInteractionResponseChannelMessageWithSource
  | CustomAPIInteractionResponseDeferredChannelMessageWithSource
  | APIInteractionResponseDeferredMessageUpdate
  | APIInteractionResponsePong
  | CustomAPIInteractionResponseUpdateMessage
  | APIModalInteractionResponse
  | APIPremiumRequiredInteractionResponse;

export type CamelizedInteraction = ObjectToCamel<APIBaseInteraction<InteractionType, any>>;
export type CamelizedUser = ObjectToCamel<APIUser>;
export type CamelizedGuildMember = ObjectToCamel<APIGuildMember>;

export type CamelizedCustomAPIInteractionResponseCallbackData =
  ObjectToCamel<CustomAPIInteractionResponseCallbackData>;

export interface CustomAPIInteractionResponseCallbackData
  extends Omit<APIInteractionResponseCallbackData, 'attachments'> {
  attachments?: InteractionResponseAttachment[] | undefined;
}

export interface CustomAPIInteractionResponseChannelMessageWithSource
  extends Omit<APIInteractionResponseChannelMessageWithSource, 'data'> {
  data: CustomAPIInteractionResponseCallbackData;
}

export interface CustomAPIInteractionResponseDeferredChannelMessageWithSource
  extends Omit<APIInteractionResponseDeferredChannelMessageWithSource, 'data'> {
  data: Pick<CustomAPIInteractionResponseCallbackData, 'flags'>;
}

export interface CustomAPIInteractionResponseUpdateMessage
  extends Omit<APIInteractionResponseUpdateMessage, 'data'> {
  data: CustomAPIInteractionResponseCallbackData;
}
