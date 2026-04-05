require('dotenv').config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('시작')
    .setDescription('원정대 등록 시작'),
  new SlashCommandBuilder()
    .setName('레이드')
    .setDescription('레이드 메뉴'),
  new SlashCommandBuilder()
    .setName('정병사유')
    .setDescription('반영안됨'),
].map(cmd => cmd.toJSON());


const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID, process.env.SERVER_ID),
    { body: commands }
  );
})();