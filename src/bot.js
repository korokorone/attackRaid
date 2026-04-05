const { Client, GatewayIntentBits } = require('discord.js');

function createClient() {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds]
  });

  client.once('ready', () => {
    console.log('봇 실행됨');
  });

  return client;
}

module.exports = createClient;