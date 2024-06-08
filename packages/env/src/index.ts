export default {
  WebsitePort: Number.parseInt(process.env.WEBSITE_PORT || '0'),
  WebsiteClusters: Number.parseInt(process.env.WEBSITE_CLUSTERS || '0'),

  DiscordClientId: process.env.DISCORD_CLIENT_ID as string,
  DiscordPublicKey: process.env.DISCORD_PUBLIC_KEY as string,
  DiscordToken: process.env.DISCORD_TOKEN as string,
};
