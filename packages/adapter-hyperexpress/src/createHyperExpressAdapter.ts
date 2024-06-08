import crypto from 'node:crypto';
import { Readable } from 'node:stream';
import { verify } from 'discord-verify/node';
import { createMultipartResponse } from '../../utils/src';

import type { BaseInteraction, Events, InteractionEnv } from '@httpi/client';
import type HyperExpress from 'hyper-express';

/**
 * Create a HyperExpress middleware for HTTP interactions
 * @param opts The public key and events
 * @returns The middleware
 */
export function createHyperExpressAdapter(opts: {
  env?: InteractionEnv;
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
        env: opts.env ?? process.env,
        interaction,
        user: interaction.member?.user || interaction.user,
        async respond(message) {
          // @ts-ignore If message.data.attachments isn't a value, the message doesn't have attachments
          if (!message?.data?.attachments?.length) return res.json(message);
          // Create attachment response
          const { formData, boundary } = createMultipartResponse(message);
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
