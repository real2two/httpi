import crypto from 'node:crypto';
import { verifyKey } from 'discord-interactions';
import { createMultipartResponse } from '../../utils/src';

import type { BaseInteraction, Events, InteractionEnv } from '@httpi/client';
import type { IRequest } from 'itty-router';

/**
 * Create a HyperExpress middleware for HTTP interactions
 * @param opts The request, public key and events
 * @returns The middleware
 */
export async function handleIttyRouterRequest({
  autoResolve = true,
  request,
  env,
  publicKey,
  events,
}: {
  autoResolve?: boolean;
  request: IRequest;
  env?: InteractionEnv;
  publicKey: string;
  events: Events;
}) {
  // Validates if the interaction is coming from Discord
  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');
  const body = await request.text();

  if (!signature) return new Response('Missing signature', { status: 400 });
  if (!timestamp) return new Response('Missing timestamp', { status: 400 });

  const isValid = await verifyKey(body, signature, timestamp, publicKey);
  if (!isValid) return new Response('Invalid signature', { status: 401 });

  // Handles interactions
  const interaction = JSON.parse(body) as BaseInteraction;
  let resolved = false;
  return new Promise((resolve) => {
    const resolvedTimeout = autoResolve
      ? setTimeout(() => {
          resolved = true;
          return resolve(new Response());
        }, 3000)
      : null;
    events[interaction.type]?.execute({
      env: env ?? process.env,
      interaction,
      user: interaction.member?.user || interaction.user,
      async respond(message) {
        if (resolved) return null;
        if (resolvedTimeout) clearTimeout(resolvedTimeout);
        resolved = true;
        // @ts-ignore If message.data.attachments isn't a value, the message doesn't have attachments
        if (!message?.data?.attachments?.length) {
          return resolve(
            new Response(JSON.stringify(message), {
              headers: {
                'content-type': 'application/json',
              },
            }),
          );
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
  });
}
