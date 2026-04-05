const connection = require("../db/connection");

async function saveCharacters(guildId, userId, characters, isActivate) {
  for (const c of characters) {
    await connection`
      INSERT INTO lostark.characters (name, level, class, combat_level, user_id, server_id, is_activate)
      VALUES (${c.name}, ${c.level}, ${c.class}, ${c.combatLevel}, ${userId}, ${guildId}, ${isActivate})
      ON CONFLICT (server_id, user_id, name)
      DO UPDATE SET
        level = EXCLUDED.level,
        combat_level = EXCLUDED.combat_level
      `;
    //[c.name, c.level, c.class, c.combatLevel, userId, guildId, isActivate]
  }
}

async function selectCharacters(guildId, userId) {
  const result = await connection`
        select name, level, class, combat_level, is_activate
        from lostark.characters 
        where server_id = ${guildId}
        and user_id = ${userId};
      `;

  return result;
}

async function selectActivatedCharacters(serverId, userId) {
  const result = await connection`
        select name, level, class, combat_level, is_activate
        from lostark.characters 
        where server_id = ${serverId}
        and user_id = ${userId}
        and is_activate = TRUE;
      `;

  return result;
}

async function unactivateCharacters(guildId, userId) {
  await connection`
      UPDATE lostark.characters
      SET is_activate = false
      WHERE server_id = ${guildId}
      AND user_id = ${userId};
    `;
}

async function activateCharacters(guildId, userId, selectedList) {
  for (const name of selectedList) {
    await connection`
        UPDATE lostark.characters
        SET is_activate = true
        WHERE server_id = ${guildId}
        AND user_id = ${userId}
        AND name = ${name};
      `;
  }
}

module.exports = {
  saveCharacters,
  selectCharacters,
  activateCharacters,
  unactivateCharacters,
  selectActivatedCharacters,
};
