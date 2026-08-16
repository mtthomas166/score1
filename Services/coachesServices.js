const api = require("./soccersApi");
const Coach = require("../models/coachModel");
const Team = require("../models/teamModel");

async function syncCoaches() {
  try {
    const res = await api.get("coaches/");
    const coaches = res.data.data || [];

    if (!coaches.length) {
      console.log("not exist any coach");
      return;
    }

    const ops = [];

    const teams = await Team.find().lean();
    const teamByApiId = new Map(teams.map((t) => [t.apiId, t]));

    for (const c of coaches) {
      const team = teamByApiId.get(c.team.id);
      const state = teamByApiId.get(c.country.id);

      ops.push({
        updateOne: {
          filter: { apiId: c.id },
          update: {
            $set: {
              apiId: c.id,
              name: c.name,
              avatar: c.image,
              birthDate: c.birthdate,
              team: team ? team._id : null,
              state: state ? state._id : null,
            },
          },
          upsert: true,
        },
      });
    }

    await Coach.bulkWrite(ops);
  } catch (err) {
    console.error("syncAllCoaches error:", err.message);
  }
}
syncCoaches();
