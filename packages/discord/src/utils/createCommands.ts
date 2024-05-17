import { Command } from '../';

export async function createCommands({
  id,
  token,
  commands,
}: { id: string; token: string; commands: Command[] }) {
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
