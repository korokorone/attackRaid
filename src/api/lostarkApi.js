const axios = require("axios");

const client = axios.create({
  baseURL: "https://developer-lostark.game.onstove.com",
  headers: {
    accept: "application/json",
    authorization: "bearer " + process.env.LOSTARK_API_KEY,
  },
});

// 캐릭터 목록 조회
async function getSiblings(nickname) {
  console.log("flag2");
  try {
    const response = await client.get(
      `/characters/${encodeURIComponent(nickname)}/siblings`,
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error(err.response?.data);
  }
}

async function getCombatLevel(nickname) {
  try {
    const response = await client.get(
      `/armories/characters/${encodeURIComponent(nickname)}/profiles`,
    );

    const combatPower = response.data?.CombatPower;

    console.log(nickname, combatPower);

    return combatPower ?? 0;
  } catch (error) {
    console.error(
      "combatLevel error:",
      nickname,
      error.response?.data || error.message,
    );
    return 0;
  }
}

module.exports = {
  getSiblings,
  getCombatLevel,
};
