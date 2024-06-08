import { Buffer } from 'node:buffer';
import type { CustomAPIInteractionResponse, InteractionResponseAttachment } from '@httpi/client';
import type { RESTAPIAttachment } from 'discord-api-types/v10';

export function createMultipartResponse(message: CustomAPIInteractionResponse) {
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

  // Return data
  return { formData, boundary };
}
