import crypto from 'node:crypto';
import { Readable } from 'node:stream';
import { verify } from 'discord-verify/node';
import { createMultipartResponse } from '../../utils/src';

import type { BaseInteraction, Events, InteractionEnv } from '@httpi/client';
import type uWebSockets from 'uWebSockets.js';

/**
 * Create a HyperExpress middleware for HTTP interactions
 * @param opts The public key and events
 * @returns The middleware
 */
export function createUWebsocketsAdapter(opts: {
  env?: InteractionEnv;
  publicKey: string;
  events: Events;
}) {
  return (res: uWebSockets.HttpResponse, req: uWebSockets.HttpRequest) => {
    // Validates if the interaction is coming from Discord
    const signature = req.getHeader('x-signature-ed25519');
    const timestamp = req.getHeader('x-signature-timestamp');

    let buffer: Buffer;
    res.onData(async (ab, isLast) => {
      const chunk = Buffer.from(ab);
      buffer = buffer ? Buffer.concat([buffer, chunk]) : Buffer.concat([chunk]);
      if (!isLast) return;

      const body = buffer.toString();
      const isValid = await verify(
        body,
        signature,
        timestamp,
        opts.publicKey,
        crypto.webcrypto.subtle,
      );
      if (!isValid) {
        return res.cork(() => {
          res.writeStatus('401 Unauthorized').end('Invalid signature');
        });
      }

      // Handles interactions
      try {
        const interaction = JSON.parse(body) as BaseInteraction;
        return opts.events[interaction.type]?.execute({
          env: opts.env ?? process.env,
          interaction,
          user: interaction.member?.user || interaction.user,
          respond(message) {
            // @ts-ignore If message.data.attachments isn't a value, the message doesn't have attachments
            if (!message?.data?.attachments?.length) {
              return res.cork(() => {
                res.writeHeader('content-type', 'application/json').end(JSON.stringify(message));
              });
            }

            return new Promise((resolve) => {
              // Responds with attachments (multipart/form-data)
              const { formData, boundary } = createMultipartResponse(message);
              const readable = Readable.from(formData);

              readable
                .on('data', (chunk: Buffer) => {
                  res.cork(() => {
                    const ab = chunk.buffer.slice(
                      chunk.byteOffset,
                      chunk.byteOffset + chunk.byteLength,
                    );

                    const lastOffset = res.getWriteOffset();
                    const [ok, done] = res
                      .writeHeader('content-type', `multipart/form-data; boundary=${boundary}`)
                      .tryEnd(ab, readable.readableLength);

                    if (done) {
                      onFinished();
                    } else if (!ok) {
                      readable.pause();

                      res.ab = ab;
                      res.abOffset = lastOffset;

                      res.onWritable((offset: number) => {
                        const [ok, done] = res.tryEnd(
                          res.ab.slice(offset - res.abOffset),
                          readable.readableLength,
                        );
                        if (done) {
                          onFinished();
                        } else if (ok) {
                          readable.resume();
                        }

                        return ok;
                      });
                    }
                  });
                })
                .on('error', (err) => {
                  console.error(err);

                  readable.destroy();
                  res.cork(() => res.end());

                  resolve(res);
                });

              res.onAborted(() => onFinished());

              function onFinished() {
                if (res.id !== -1) {
                  readable.destroy();
                  resolve(res);
                }
                res.id = -1;
              }
            });
          },
        });
      } catch (err) {
        return console.error(err);
      }
    });

    res.onAborted(() => null);
  };
}
