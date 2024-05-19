import {
  APIBaseInteraction,
  APIInteractionResponse,
  APIUser,
  InteractionType,
} from 'discord-api-types/v10';

export type BaseInteraction = APIBaseInteraction<InteractionType, any>;

export interface InteractionResponseAttachment {
  name: string;
  data: any;
}

export interface InteractionRequestData {
  interaction: BaseInteraction;
  user?: APIUser;
  respond: (message: APIInteractionResponse) => Promise<unknown>;
}

export interface InteractionRequestDataWithUser extends InteractionRequestData {
  user: APIUser;
}

export type InteractionRequest = (data: InteractionRequestData) => unknown;
export type InteractionRequestWithUser = (data: InteractionRequestDataWithUser) => unknown;
