const api = require("./soccersApi");
const Referee = require("../models/refereeModel");
const Team = require("../models/teamModel");

async function syncReferees() {
  try {
    const res = await api.get("referees/");
    const referees = res.data.data || [];

    if (!referees.length) {
      console.log("not exist any referee");
      return;
    }

    const ops = [];

    const countries = await Team.find();
    let countryMap = {};
    countries.forEach((c) => {
      countryMap[c.apiId] = c._id;
    });

    for (const r of referees) {

      ops.push({
        updateOne: {
          filter: { apiId: r.id },
          update: {
            $set: {
              apiId: r.id,
              name: r.name,
              age: r.age,
              type: r.type,
              avatar: r.image,
              sex: r.sex,
              birthDate: r.birthdate,
              country: countryMap[r.nationalTeam?.id],
              isInternational: r.isInternational || null,
            },
          },
          upsert: true,
        },
      });
    }

    await Referee.bulkWrite(ops);
  } catch (err) {
    console.error("syncAllreferees error:", err.message);
  }
}
syncReferees();
