const {
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

async function handleRaid(interaction) {
  const button1 = new ButtonBuilder()
    .setCustomId("raid_type_create_button")
    .setLabel("레이드 종류 생성")
    .setStyle(ButtonStyle.Primary);

  const button2 = new ButtonBuilder()
    .setCustomId("raid_type_select_button")
    .setLabel("레이드 종류 선택")
    .setStyle(ButtonStyle.Primary);

  const button3 = new ButtonBuilder()
    .setCustomId("setup")
    .setLabel("게시판 만들기")
    .setStyle(ButtonStyle.Primary);

  const row1 = new ActionRowBuilder().addComponents(button1, button2, button3);

  await interaction.reply({
    content: `이게 되나?`,
    components: [row1],
  });
}

module.exports = handleRaid;
