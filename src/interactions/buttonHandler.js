const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  LabelBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

const characterService = require("../services/characterService");
const characterRepository = require("../repositories/characterRepository");
const raidRepository = require("../repositories/raidRepository");

async function handleButton(interaction) {
  const guildId = interaction.guildId;
  const userId = interaction.user.id;

  if (interaction.customId === "start_input") {
    const nickname_modal = new ModalBuilder()
      .setCustomId("nickname_modal")
      .setTitle("닉네임 입력");

    const nickname = new TextInputBuilder()
      .setCustomId("nickname")
      .setLabel("닉네임을 입력하세요")
      .setStyle(TextInputStyle.Short);

    const row1 = new ActionRowBuilder().addComponents(nickname);
    nickname_modal.addComponents(row1);

    await interaction.showModal(nickname_modal);
  } else if (interaction.customId === "setup") {
    await interaction.guild.channels.create({
      name: "레이드-게시판",
      type: 15, // GUILD_FORUM
    });
  } else if (interaction.customId === "show_characters") {
    await interaction.deferReply({ ephemeral: true });

    const characters = await characterRepository.selectCharacters(
      guildId,
      userId,
    );

    if (!characters.length) {
      return interaction.editReply({
        content: "캐릭터 없음",
      });
    }

    const options = characters.map((c) => ({
      label: `${c.name} (${c.level})`,
      description: c.class,
      value: c.name,
      default: c.is_activate, // 체크 상태 유지
    }));

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("select_character")
      .setPlaceholder("활성 캐릭터 선택")
      .setMinValues(0)
      .setMaxValues(options.length)
      .addOptions(options);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.editReply({
      content: "활성 캐릭터를 선택하세요",
      components: [row],
    });
  } else if (interaction.customId === "raid_type_create_button") {
    const raid_type_create_modal = new ModalBuilder()
      .setCustomId("raid_type_create_modal")
      .setTitle("레이드 종류 만들기");

    const raidName = new TextInputBuilder()
      .setCustomId("raidName")
      .setLabel("레이드 이름을 입력하게요")
      .setStyle(TextInputStyle.Short);
    const dealerNumber = new TextInputBuilder()
      .setCustomId("dealerNumber")
      .setLabel("딜러의 숫자를 입력하세요")
      .setStyle(TextInputStyle.Short);
    const supporterNumber = new TextInputBuilder()
      .setCustomId("supporterNumber")
      .setLabel("서포터의 숫자를 입력하세요")
      .setStyle(TextInputStyle.Short);
    console.log("에?");

    const row1 = new ActionRowBuilder().addComponents(raidName);
    const row2 = new ActionRowBuilder().addComponents(dealerNumber);
    const row3 = new ActionRowBuilder().addComponents(supporterNumber);
    raid_type_create_modal.addComponents(row1, row2, row3);

    await interaction.showModal(raid_type_create_modal);
  } else if (interaction.customId === "raid_type_select_button") {
    const raids = await raidRepository.selectRaid(guildId);

    console.log(raids);

    const options = raids.map((r) =>
      new StringSelectMenuOptionBuilder()
        .setLabel(r.raid_name)
        .setValue(r.raid_name),
    );

    const hourOptions = Array.from({ length: 24 }, (_, i) =>
      new StringSelectMenuOptionBuilder().setLabel(`${i}시`).setValue(`${i}`),
    );

    const minuteOptions = Array.from({ length: 12 }, (_, i) => {
      const min = i * 5;
      return new StringSelectMenuOptionBuilder()
        .setLabel(`${min}분`)
        .setValue(`${min}`);
    });

    const customValues = ["A", "B", "C"]; // 니가 넣고 싶은 값

    const customOptions = customValues.map((v) =>
      new StringSelectMenuOptionBuilder().setLabel(v).setValue(v),
    );

    const dateOptions = Array.from({ length: 21 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);

      const days = ["일", "월", "화", "수", "목", "금", "토"];

      const label = d.toISOString().split("T")[0] + " " + days[d.getDay()];
      const value = d.toISOString().split("T")[0];

      return new StringSelectMenuOptionBuilder()
        .setLabel(label)
        .setValue(value); // YYYY-MM-DD
    });

    console.log("falg");

    const raid_type_select_modal = new ModalBuilder()
      .setCustomId("raid_type_select_modal")
      .setTitle("레이드 종류 선택");

    const select1 = new LabelBuilder()
      .setLabel("raid_options")
      .setDescription("레이드를 선택하시오")
      .setStringSelectMenuComponent(
        new StringSelectMenuBuilder()
          .setCustomId("selected_raid_name")
          .setPlaceholder("Choose your raid")
          .setRequired(true)
          .setOptions(options),
      );

    const select2 = new LabelBuilder()
      .setLabel("hour_options")
      .setDescription("시간을 선택하세요")
      .setStringSelectMenuComponent(
        new StringSelectMenuBuilder()
          .setCustomId("selected_hour")
          .setPlaceholder("Choose your raid")
          .setRequired(true)
          .setOptions(hourOptions),
      );

    const select3 = new LabelBuilder()
      .setLabel("minute_options")
      .setDescription("분을 선택해주세요")
      .setStringSelectMenuComponent(
        new StringSelectMenuBuilder()
          .setCustomId("selected_minute")
          .setPlaceholder("Choose your raid")
          .setRequired(true)
          .setOptions(minuteOptions),
      );

    const select4 = new LabelBuilder()
      .setLabel("date_options")
      .setDescription("날자를 선택해주세요")
      .setStringSelectMenuComponent(
        new StringSelectMenuBuilder()
          .setCustomId("selected_date")
          .setPlaceholder("Choose your raid")
          .setRequired(true)
          .setOptions(dateOptions),
      );

    const select5 = new LabelBuilder()
      .setLabel("difficulty_options")
      .setDescription("난이도를 선택해주세요")
      .setStringSelectMenuComponent(
        new StringSelectMenuBuilder()
          .setCustomId("selected_difficulty")
          .setPlaceholder("Choose your raid")
          .setRequired(true)
          .setOptions(customOptions),
      );

    const raid_title = new TextInputBuilder()
      .setCustomId("raid_title")
      .setLabel("레이드 제목입력")
      .setStyle(TextInputStyle.Short);

    const row1 = new ActionRowBuilder().addComponents(raid_title);

    raid_type_select_modal.addComponents(
      select1,
      select2,
      select3,
      select4,
      select5,
    );

    await interaction.showModal(raid_type_select_modal);
  }
}

module.exports = handleButton;
