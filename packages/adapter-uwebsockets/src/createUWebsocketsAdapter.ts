import crypto from 'crypto';
import uWebSockets from 'uWebSockets.js';
import { verify } from 'discord-verify/node';
import { Readable } from 'stream';

import type { RESTAPIAttachment } from 'discord-api-types/v10';
import type { BaseInteraction, InteractionResponseAttachment, Events } from '@httpi/client';

/**
 * Create a HyperExpress middleware for HTTP interactions
 * @param opts The public key and events
 * @returns The middleware
 */
export function createUWebsocketsAdapter(opts: {
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
              const formData = Buffer.concat([
                ...formDataParts,
                Buffer.from(`--${boundary}--\r\n`),
              ]);

              // Responds with attachments (multipart/form-data)

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
