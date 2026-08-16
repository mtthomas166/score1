const api = require("./soccersApi");
const League = require("../models/leagueModel");

async function syncLeagues() {
  try {
    const res = await api.get("leagues/");
    const leagues = res.data.data || [];

    if (!channelsData.length) {
      console.log("not exist any league");
      return;
    }

    const ops = [];

    for (const l of leagues) {
      ops.push({
        updateOne: {
          filter: { apiId: c.id },
          update: {
            $set: {
              apiId: l.id,
              name: l.name || null,
              country: l.country || null,
              logo: l.logo || null,
              type: c.type || null,
              foundedYear: l.founded ? new Date(`${l.founded}-01-01`) : null,
              startDate: l.season_start || null,
              endDate: l.season_end || null,
            },
          },
          upsert: true,
        },
      });
    }

    await League.bulkWrite(ops);
  } catch (err) {
    console.error("syncLeagues error:", err.message);
  }
}
syncLeagues();
