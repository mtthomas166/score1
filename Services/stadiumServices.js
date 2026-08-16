const api = require("./soccersApi");
const Stadium = require("../models/stadium");
const Team = require("../models/teamModel");

async function syncStadiums() {
  try {
    const res = await api.get("stadiums/");
    const stadiums = res.data.data || [];

    if (!stadiums.length) {
      console.log("No stadiums found from API");
      return;
    }

    const teams = await Team.find({}, "apiId");
    const teamMap = {};
    teams.forEach((t) => {
      teamMap[t.apiId] = t._id;
    });

    const ops = [];

    for (const s of stadiums) {
      ops.push({
        updateOne: {
          filter: { apiId: s.id },
          update: {
            $set: {
              apiId: s.id,
              name: s.name,
              numberOfSeats: s.numberOfSeats,
              dateOfCreation: s.dateOfCreation,
              location: s.location,
              country: s.country,
              team: teamMap[s.team?.id] || null,
              nationalTeam: teamMap[s.nationalTeam?.id] || null,
              length: s.length,
              width: s.width,
            },
          },
          upsert: true,
        },
      });
    }

    await Stadium.bulkWrite(ops);
  } catch (err) {
    console.error("syncAllStadiums error:", err);
  }
}
syncStadiums();  