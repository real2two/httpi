import crypto from 'crypto';
import HyperExpress from 'hyper-express';
import { verify } from 'discord-verify/node';
import { Readable } from 'stream';

import type { RESTAPIAttachment } from 'discord-api-types/v10';
import type { BaseInteraction, InteractionResponseAttachment, Events } from '@httpi/client';

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
    try {
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
      const interaction = JSON.parse(body) as BaseInteraction;
      return opts.events[interaction.type]?.execute({
        interaction,
        user: interaction.member?.user || interaction.user,
        async respond(message) {
          // @ts-ignore If message.data.attachments isn't a value, the message doesn't have attachments
          if (!message?.data?.attachments?.length) return res.json(message);

          // @ts-ignore Create the form data
          const attachments = message?.data?.attachments as InteractionResponseAttachment[];

          const boundary = `----WebKitFormBoundary${Math.random().toString(36).substring(2)}`;
          const disposition = `--${boundary}\r\nContent-Disposition: form-data;`;
          const formDataParts: Buffer[] = [];
          const messageAttachments: RESTAPIAttachment[] = [];

          // Append the JSON body
          formDataParts.push(
            Buffer.from(
              `${disposition} name="payload_json"\r\n\r\n${JSON.stringify({
                type: message.type,
                data: {
                  // @ts-ignore
                  ...message.data,
                  attachments: messageAttachments,
                },
              })}\r\n`,
            ),
          );

          // Append files
          for (let id = 0; id < attachments.length; ++id) {
            messageAttachments.push({
              id,
              filename: attachments[id].name,
            });

            formDataParts.push(
              Buffer.from(
                `${disposition} name="files[${id}]"; filename="${attachments[id].name}"\r\nContent-Type: application/octet-stream\r\n\r\n`,
              ),
              Buffer.from(attachments[id].data),
              Buffer.from('\r\n'),
            );
          }

          // Create the full formData
          const formData = Buffer.concat([...formDataParts, Buffer.from(`--${boundary}--\r\n`)]);

          // Sets the correct headers
          res.header('content-type', `multipart/form-data; boundary=${boundary}`);

          // Responds with attachments (multipart/form-data)
          return await new Promise((resolve) => {
            res.on('close', resolve);
            res.stream(Readable.from(formData));
          });
        },
      });
    } catch (err) {
      return console.error(err);
    }
  };
}
