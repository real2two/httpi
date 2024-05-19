import { Command } from '../index.js';

import { FetchLike } from '../types/createCommands.js';

export async function createCommands({
  id,
  token,
  commands,
  fetch = global.fetch,
}: { id: string; token: string; commands: Command[], fetch?: FetchLike }) {
  const res = await fetch(`https://discord.com/api/applications/${id}/commands`, {
    method: 'put',
    headers: {
      authorization: `Bot ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(commands.map((c) => c.data)),
  });

  return await res.json();
}
