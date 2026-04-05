require('dotenv').config();

const startServer = require('./server/express');
const createClient = require('./bot');

const handleStart = require('./commands/start');
const handleRaid = require('./commands/raidCommand');
const handleButton = require('./interactions/buttonHandler');
const handleModal = require('./interactions/modalHandler');
const handleSelect = require('./interactions/selectHandler')

const client = createClient();

// interaction 중앙 처리
client.on('interactionCreate', async (interaction) => {
  try {
    // 슬래시 명령어
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === '시작') {
        await handleStart(interaction);
      }
      if (interaction.commandName === '레이드') {
        await handleRaid(interaction);
      }
    }

    // 버튼
    if (interaction.isButton()) {
      await handleButton(interaction);
    }

    // 모달
    if (interaction.isModalSubmit()) {
      await handleModal(interaction);
    }

    if (interaction.isStringSelectMenu()) {
      await handleSelect(interaction);
    }

  } catch (error) {
    console.error(error);
  }
});

// 실행
startServer();
client.login(process.env.TOKEN);