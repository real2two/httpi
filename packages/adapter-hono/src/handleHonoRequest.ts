import crypto from 'node:crypto';
import { verify } from 'discord-verify/node';
import { createMultipartResponse } from '../../utils/src';

import type { BaseInteraction, Events, InteractionEnv } from '@httpi/client';
import type { Context } from 'hono';

/**
 * Create a HyperExpress middleware for HTTP interactions
 * @param opts The request, public key and events
 * @returns The middleware
 */
export async function handleHonoRequest({
  context,
  publicKey,
  events,
}: {
  context: Context;
  publicKey: string;
  events: Events;
}) {
  // Validates if the interaction is coming from Discord
  const signature = context.req.header('x-signature-ed25519');
  const timestamp = context.req.header('x-signature-timestamp');
  const body = await context.req.text();

  const isValid = await verify(body, signature, timestamp, publicKey, crypto.webcrypto.subtle);
  if (!isValid) return context.text('Invalid signature', 401);

  // Handles interactions
  const interaction = JSON.parse(body) as BaseInteraction;
  let resolved = false;
  return new Promise((resolve) => {
    const resolvedTimeout = setTimeout(() => {
      resolved = true;
      return resolve(context.text(''));
    }, 3000);
    events[interaction.type]?.execute({
      env: context.env,
      interaction,
      user: interaction.member?.user || interaction.user,
      async respond(message) {
        if (resolved) return null;
        clearTimeout(resolvedTimeout);
        resolved = true;
        // @ts-ignore If message.data.attachments isn't a value, the message doesn't have attachments
        if (!message?.data?.attachments?.length) {
          return resolve(context.json(message));
        }
        // Create attachment response
        // This is where the FormData and boundary is given
        const { formData, boundary } = createMultipartResponse(message);
        // Responds with attachments (multipart/form-data)
        return resolve(
          new Response(formData, {
            headers: {
              'content-type': `multipart/form-data; boundary=${boundary}`,
            },
          }),
        );
      },
    });
  }) as Promise<Response>;
}
