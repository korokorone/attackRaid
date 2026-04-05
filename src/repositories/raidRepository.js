const connection = require("../db/connection");

async function saveRaid(raidName, dealrNumber, supporterNumber, serverId) {
  await connection`
      INSERT INTO lostark.raid (raid_name, dealer_number, supporter_number, server_id)
      VALUES (${raidName}, ${dealrNumber}, ${supporterNumber}, ${serverId})
      ON CONFLICT (server_id, raid_name)
      DO UPDATE SET
        dealer_number = EXCLUDED.dealer_number,
        supporter_number = EXCLUDED.supporter_number
      `;
  //[c.name, c.level, c.class, c.combatLevel, userId, guildId, isActivate]
}

async function selectRaid(serverId) {
  const result = await connection`
      Select raid_name from lostark.raid
      where server_id = ${serverId}
      `;
  //1060149722020589609

  return result;
}

async function createDetailRaid(
  selected_raid_name,
  selected_hour,
  selected_date,
  selected_minute,
  selected_difficulty,
  server_id,
  user_id,
) {
  await connection`
    INSERT INTO lostark.created_raid (raid_name, hour, date, minute, difficulty, server_id, created_user)
    VALUES (${selected_raid_name}, ${selected_hour}, ${selected_date}, ${selected_minute}, ${selected_difficulty}, ${server_id}, ${user_id})
    `;
}

async function getRaidList() {
  const result = await connection`
    SELECT
      cr.*,

      COALESCE(COUNT(CASE WHEN rp.role = 'dealer' THEN 1 END), 0) AS dealer_count,
      COALESCE(COUNT(CASE WHEN rp.role = 'supporter' THEN 1 END), 0) AS supporter_count,

      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'character', rp.character_name,
            'userId', rp.user_id,
            'role', rp.role
          )
        ) FILTER (WHERE rp.id IS NOT NULL),
        '[]'
      ) AS participants

    FROM lostark.created_raid cr

    LEFT JOIN lostark.raid_participant rp
      ON cr.id = rp.raid_id

    WHERE cr.published = TRUE

    GROUP BY cr.id

    ORDER BY cr.date, cr.hour, cr.minute;
    `;

  return result;
}

async function getRaidInfo(id) {
  const result = await connection`
    SELECT
      cr.*,
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'character', rp.character_name,
          'userId', rp.user_id,
          'role', rp.role
        )
      ) FILTER (WHERE rp.id IS NOT NULL) AS participants
    FROM lostark.created_raid cr
    LEFT JOIN lostark.raid_participant rp
      ON cr.id = rp.raid_id
    WHERE cr.id = ${id}
    GROUP BY cr.id
  `;

  return result;
}
async function participantRaid(
  raid_id,
  character_name,
  user_id,
  server_id,
  role,
) {
  await connection`
    INSERT INTO lostark.raid_participant
    (raid_id, character_name, user_id, server_id, role)
    VALUES (${raid_id}, ${character_name}, ${user_id}, ${server_id}, ${role})
    ON CONFLICT (raid_id, character_name)
    DO NOTHING
  `;
}

async function leaveRaid(raidId, characterName, userId) {
  await connection`
      DELETE FROM lostark.raid_participant
      WHERE raid_id = ${raidId}
        AND character_name = ${characterName}
        AND user_id = ${userId}
    `;
}

module.exports = {
  saveRaid,
  selectRaid,
  createDetailRaid,
  getRaidList,
  getRaidInfo,
  participantRaid,
  leaveRaid,
};
