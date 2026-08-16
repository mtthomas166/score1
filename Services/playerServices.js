const api = require("./soccersApi");
const Player = require("../models/playerModel");
const Team = require("./../models/teamModel");

async function syncPlayers() {
  try {
    const res = await api.get("players/");
    const players = res.data.data || [];

    if (!players.length) {
      console.log("not exist any player");
      return;
    }

    const ops = [];

    const teams = await Team.find();
    const teamByApiId = new Map(teams.map((t) => [t.apiId, t._id]));

    for (const p of players) {
      const currentTeamId = teamByApiId.get(p.team?.id) || null;
      const nationalTeamId = teamByApiId.get(p.nationalTeam?.id) || null;

      ops.push({
        updateOne: {
          filter: { apiId: p.id },
          update: {
            $set: {
              apiId: p.id,
              name: p.name,
              avatar: p.image,
              age: p.age,
              length: p.length,
              width: p.width,
              currentTeam: currentTeamId || null,
              nationalTeam: nationalTeamId || null,
            },
          },
          upsert: true,
        },
      });
    }

    await Player.bulkWrite(ops);
  } catch (err) {
    console.error("syncAllPlayers error:", err.message);
  }
}
module.exports = syncPlayers();