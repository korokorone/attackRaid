const lostarkApi = require("../api/lostarkApi");

async function getCharacterList(nickname) {
  console.log(nickname);
  console.log(nickname.length);
  const characters = await lostarkApi.getSiblings(nickname);

  // 필요하면 여기서 가공 가능
  const result = await Promise.all(
    characters.map(async (c) => ({
      name: c.CharacterName,
      level: c.ItemAvgLevel,
      class: c.CharacterClassName,
      combatLevel: await lostarkApi.getCombatLevel(c.CharacterName),
    })),
  );

  return result;
}

module.exports = {
  getCharacterList,
};
