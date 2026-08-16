const api = require("./soccersApi");
const Team = require("./../models/teamModel");
const Stadium = require("../models/stadium");

async function syncTeams() {
  try {
    const res = await api.get("teams/");
    const teams = res.data.data || [];

    if (!teams.length) {
      console.log("not exist any team");
      return;
    }

    const countries = await Team.find({}, "apiId");
    const teamMap = {};
    teams.forEach((t) => {
      teamMap[t.apiId] = t._id;
    });

    const stadiums = await Sfind({}, "apiId");
    const stadiumMap = {};
    stadiums.forEach((s) => {
      stadiumMap[s.apiId] = s._id;
    });

    let ops = [];

    for (const t of teams) {
      ops.push({
        updateOne: {
          filter: { apiId: t.id },
          update: {
            $set: {
              apiId: t.id,
              name: t.name,
              logo: t.image,

              information: {
                achievements: t.achievements || [],
                country: stadiumMap[t.country?.id] || undefined,
                level: t.level || undefined,
                stadium: stadiumMap[t.stadium?.id] || undefined,
                federation: t.federation || undefined,
                description: t.description || undefined,
              },
            },
          },
          upsert: true,
        },
      });
    }

    if (ops.length) {
      await Team.bulkWrite(ops);
    }
  } catch (err) {
    console.error("syncAllTeams error:", err.message);
  }
};
syncTeams();
