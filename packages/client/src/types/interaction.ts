import type {
  APIApplicationCommandAutocompleteResponse,
  APIBaseInteraction,
  APIInteractionResponseCallbackData,
  APIInteractionResponseChannelMessageWithSource,
  APIInteractionResponseDeferredChannelMessageWithSource,
  APIInteractionResponseDeferredMessageUpdate,
  APIInteractionResponsePong,
  APIInteractionResponseUpdateMessage,
  APIModalInteractionResponse,
  APIPremiumRequiredInteractionResponse,
  APIUser,
  InteractionType,
} from 'discord-api-types/v10';

// biome-ignore lint/suspicious/noExplicitAny:
export type BaseInteraction = APIBaseInteraction<InteractionType, any>;

export type CustomAPIInteractionResponse =
  | APIApplicationCommandAutocompleteResponse
  | CustomAPIInteractionResponseChannelMessageWithSource
  | CustomAPIInteractionResponseDeferredChannelMessageWithSource
  | APIInteractionResponseDeferredMessageUpdate
  | APIInteractionResponsePong
  | CustomAPIInteractionResponseUpdateMessage
  | APIModalInteractionResponse
  | APIPremiumRequiredInteractionResponse;

export interface InteractionResponseAttachment {
  name: string;
  data: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>;
}

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

export interface CustomAPIInteractionResponseCallbackData
  extends Omit<APIInteractionResponseCallbackData, 'attachments'> {
  attachments?: InteractionResponseAttachment[] | undefined;
}

export interface InteractionRequestData {
  interaction: BaseInteraction;
  user?: APIUser;
  respond: (message: CustomAPIInteractionResponse) => unknown | Promise<unknown>;
}

export interface InteractionRequestDataWithUser extends InteractionRequestData {
  user: APIUser;
}

export type InteractionRequest = (data: InteractionRequestData) => unknown;
export type InteractionRequestWithUser = (data: InteractionRequestDataWithUser) => unknown;
