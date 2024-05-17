import type HyperExpress from 'hyper-express';
import type { ObjectToCamel } from 'ts-case-convert/lib/caseConvert';
import type {
  CustomAPIInteractionResponse,
  CamelizedInteraction,
  CamelizedUser,
  CustomAPIInteractionResponseUpdateMessage,
} from './discord';

export type InteractionResponse = ObjectToCamel<CustomAPIInteractionResponse>;
export type InteractionUpdateResponse =
  ObjectToCamel<CustomAPIInteractionResponseUpdateMessage>['data'];

export interface InteractionResponseAttachment {
  name: string;
  data: any;
}

export interface InteractionRequestData {
  interaction: CamelizedInteraction;
  user?: CamelizedUser;
  respond: (message: InteractionResponse) => Promise<unknown>;
  res: HyperExpress.Response<HyperExpress.DefaultResponseLocals>;
  req: HyperExpress.Request<HyperExpress.DefaultRequestLocals>;
}

export interface InteractionRequestDataWithUser extends InteractionRequestData {
  user: CamelizedUser;
}

export type InteractionRequest = (data: InteractionRequestData) => unknown;
export type InteractionRequestWithUser = (data: InteractionRequestDataWithUser) => unknown;
