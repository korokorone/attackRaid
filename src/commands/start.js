const {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require('discord.js');

async function handleStart(interaction) {
  const button1 = new ButtonBuilder()
    .setCustomId('start_input')
    .setLabel('닉네임 입력')
    .setStyle(ButtonStyle.Primary);

  const button2 = new ButtonBuilder()
    .setCustomId('show_characters')
    .setLabel('아직누르지마시오')
    .setStyle(ButtonStyle.Primary);

  const row1 = new ActionRowBuilder().addComponents(button1,button2);
  //const row2 = new ActionRowBuilder().addComponents(button2);

  const user_discord_id = interaction.user.id;
  const server_discord_id = interaction.guildId;

  await interaction.reply({
    content: `원정대 등록을 시작하세요 ${user_discord_id} ${server_discord_id}`,
    components: [row1]
  });
}

module.exports = handleStart;