import crypto from 'crypto';
import HyperExpress from 'hyper-express';
import { verify } from 'discord-verify/node';
import { objectToCamel, objectToSnake } from 'ts-case-convert';
import { FormData } from 'formdata-node';
import { FormDataEncoder } from 'form-data-encoder';
import { Readable } from 'stream';

import type { RESTAPIAttachment } from 'discord-api-types/v10';
import type { CamelizedInteraction, InteractionResponseAttachment, Events } from '../index.js';

/**
 * Create a HyperExpress middleware for HTTP interactions
 * @param opts The public key and events
 * @returns The middleware
 */
export function createHyperExpressAdapter(opts: {
  publicKey: string;
  events: Events;
}) {
  return async (req: HyperExpress.Request, res: HyperExpress.Response) => {
    // Validates if the interaction is coming from Discord
    const signature = req.header('X-Signature-Ed25519');
    const timestamp = req.header('X-Signature-Timestamp');

    const body = await req.text();

    const isValid = await verify(
      body,
      signature,
      timestamp,
      opts.publicKey,
      crypto.webcrypto.subtle,
    );

    if (!isValid) return res.status(401).send('Invalid signature');

    // Handles interactions
    const interaction = objectToCamel(JSON.parse(body)) as CamelizedInteraction; // Camelizes the request body
    try {
      return opts.events[interaction.type]?.execute({
        interaction,
        user: interaction.member?.user || interaction.user,
        respond: async (message) => {
          // @ts-ignore If message.data.attachments is a value, the message has attachments
          if (message?.data?.attachments) {
            // @ts-ignore Create the form data
            const attachments = message?.data?.attachments as InteractionResponseAttachment[];
            const formData = new FormData();

            // Create an updated message attachments object
            const messageAttachments: RESTAPIAttachment[] = [];
            for (let id = 0; id < attachments.length; ++id) {
              messageAttachments.push({
                id,
                filename: attachments[id].name,
              });
            }

            // Append the JSON body
            formData.append(
              'payload_json',
              JSON.stringify({
                type: message.type,
                data: {
                  // @ts-ignore
                  ...objectToSnake(message.data),
                  attachments: messageAttachments,
                },
              }),
            );

            // Append the files
            for (let i = 0; i < attachments.length; ++i) {
              formData.append(`files[${i}]`, new Blob([attachments[i].data]));
            }

            // Create the encoder and readable
            const encoder = new FormDataEncoder(formData);
            const readable = Readable.from(encoder);

            // Sets the correct headers
            res.header('content-type', encoder.headers['content-type']);

            // Responds with attachments (multipart/form-data)
            return await new Promise((resolve) => {
              res.on('close', resolve);
              res.stream(readable);
            });
          }

          // Responds normally (application/json)
          return res.json(objectToSnake(message)); // Puts response into snake case
        },
        res,
        req,
      });
    } catch (err) {
      return console.error(err);
    }
  };
}
