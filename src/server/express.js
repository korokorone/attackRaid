const express = require("express");
const axios = require("axios");
const cors = require("cors");

const raidRepository = require("../repositories/raidRepository");
const characterRepository = require("../repositories/characterRepository");

function startServer() {
  const app = express();

  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI;

  app.use(express.static("public"));
  app.use(express.json());
  app.use(cors());
  app.options("*", cors());

  app.get("/", (req, res) => {
    res.send("Bot is alive");
  });

  app.post("/raid/join", async (req, res) => {
    const { raidId, characterName, role, userId, serverId } = req.body;

    try {
      await raidRepository.participantRaid(
        raidId,
        characterName,
        userId,
        serverId,
        role,
      );
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).send("join error");
    }
  });

  app.delete("/raid/leave", async (req, res) => {
    const { raidId, characterName, userId } = req.body;

    try {
      await raidRepository.leaveRaid(raidId, characterName, userId);

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).send("leave error");
    }
  });

  app.get("/raid/:id", async (req, res) => {
    const id = req.params.id;

    try {
      const result = await raidRepository.getRaidInfo(id);

      res.json(result[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send("DB error");
    }
  });

  app.get("/raids", async (req, res) => {
    try {
      const result = await raidRepository.getRaidList();
      console.log(result);

      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).send("DB error");
    }
  });

  app.get("/characters", async (req, res) => {
    try {
      const serverId = req.query.serverId;
      const userId = req.query.userId;

      console.log(serverId, userId);

      const result = await characterRepository.selectActivatedCharacters(
        serverId,
        userId,
      );
      console.log(result);

      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).send("DB error");
    }
  });

  app.get("/login", (req, res) => {
    const guildId = req.query.guildId;

    const url = `https://discord.com/oauth2/authorize?client_id=1487742220131110912&response_type=code&redirect_uri=https%3A%2F%2Fattackraid.onrender.com%2Fcallback&scope=guilds+connections+identify+guilds.join+guilds.members.read&state=${guildId}`;
    res.redirect(url);
  });

  app.get("/callback", async (req, res) => {
    const code = req.query.code;
    const guildId = req.query.state;

    try {
      const tokenRes = await axios.post(
        "https://discord.com/api/oauth2/token",
        new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        },
      );

      console.log(tokenRes.data.access_token);

      const accessToken = tokenRes.data.access_token;

      const userRes = await axios.get("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const userId = userRes.data.id;

      res.redirect(`/board.html?userId=${userId}&guildId=${guildId}`);
    } catch (err) {
      console.error(err);
      res.send("에러");
    }
  });

  app.listen(process.env.PORT || 3000, () => {
    console.log("Web server running");
  });
}

module.exports = startServer;
