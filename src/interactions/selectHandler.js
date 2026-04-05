const characterRepository = require('../repositories/characterRepository');

async function handleSelect(interaction) {

  if (interaction.customId === 'select_character') {

    const selectedList = interaction.values; // 👈 핵심

    const guildId = interaction.guildId;
    const userId = interaction.user.id;

    await characterRepository.unactivateCharacters(guildId, userId);
    await characterRepository.activateCharacters(guildId, userId, selectedList)


    await interaction.reply({
      content: `선택 완료: ${selectedList.join(', ')}`,
      ephemeral: true
    });
  }
}

module.exports = handleSelect;