const { StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");

const characterService = require("../services/characterService");
const characterRepository = require("../repositories/characterRepository");
const raidRepository = require("../repositories/raidRepository");

async function handleModal(interaction) {
  const user_discord_id = interaction.user.id;
  const server_discord_id = interaction.guildId;

  if (interaction.customId === "nickname_modal") {
    const nickname = interaction.fields.getTextInputValue("nickname");

    console.log(nickname);
    try {
      await interaction.deferReply();

      const characters = await characterService.getCharacterList(nickname);
      console.log(characters);

      await characterRepository.saveCharacters(
        server_discord_id,
        user_discord_id,
        characters,
        false,
      );

      await interaction.editReply({
        content: `캐릭터 ${characters.length}개 조회됨`,
      });
    } catch (error) {
      console.error(error.message);

      await interaction.editReply({
        content: "캐릭터 조회 실패",
      });
    }
  } else if (interaction.customId === "raid_type_select_modal") {
    console.log("여기까진왔어2");

    let selected_raid_name = "";
    let selected_hour = "";
    let selected_date = "";
    let selected_minute = "";
    let selected_difficulty = "";

    if (interaction.isModalSubmit()) {
      const components = interaction.components;

      for (const row of components) {
        if (row.component.customId === "selected_raid_name")
          selected_raid_name = row.component.values[0]; // 👈 선택값 배열
        else if (row.component.customId === "selected_hour")
          selected_hour = row.component.values[0]; // 👈 선택값 배열
        else if (row.component.customId === "selected_date")
          selected_date = row.component.values[0]; // 👈 선택값 배열
        else if (row.component.customId === "selected_minute")
          selected_minute = row.component.values[0]; // 👈 선택값 배열
        else if (row.component.customId === "selected_difficulty")
          selected_difficulty = row.component.values[0]; // 👈 선택값 배열
      }
    }

    console.log(selected_raid_name);
    console.log(selected_hour);
    console.log(selected_date);
    console.log(selected_minute);
    console.log(selected_difficulty);

    try {
      await raidRepository.createDetailRaid(
        selected_raid_name,
        selected_hour,
        selected_date,
        selected_minute,
        selected_difficulty,
        server_discord_id,
        user_discord_id,
      );

      await interaction.reply({
        content: "만드러써요!",
        components: [],
      });
    } catch (error) {
      console.error(error.message);
      await interaction.reply({
        content: "유감!",
        components: [],
      });
    }
  } else if (interaction.customId === "raid_type_create_modal") {
    console.log("여기까진왔어");

    const raidName = interaction.fields.getTextInputValue("raidName");
    const dealerNumber = interaction.fields.getTextInputValue("dealerNumber");
    const supporterNumber =
      interaction.fields.getTextInputValue("supporterNumber");

    try {
      await raidRepository.saveRaid(
        raidName,
        dealerNumber,
        supporterNumber,
        server_discord_id,
      );

      await interaction.reply({
        content: `레이드 등록됨`,
      });
    } catch (error) {
      console.error(error.message);

      await interaction.reply({
        content: "레이드 등록 실패",
      });
    }
  }
}

module.exports = handleModal;
