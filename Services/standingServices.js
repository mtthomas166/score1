const axios = require("axios");
const Standing = require("../models/standingModel");
const League = require("../models/leagueModel");
const io = require("../Socket/socket");

async function hasLiveMatches(leagueApiId) {
  try {
    const res = await axios.get(`/live-matches/${leagueApiId}`);
    const liveMatches = res.data.matches || [];
    return liveMatches.length > 0;
  } catch (err) {
    console.error("Error fetching live matches:", err.message);
    return false;
  }
}

async function syncLiveStandings() {
  try {
    const leagues = await League.find({ isRoundRobin: true });

    for (const league of leagues) {
      const live = await hasLiveMatches(league.apiId);
      if (!live) continue;

      const res = await axios.get(`/standings/${league.apiId}`);
      const liveStandings = res.data.standings;

      if (!liveStandings || !liveStandings.length) continue;

      const ops = liveStandings.map((team) => ({
        updateOne: {
          filter: { league: league._id, team: team.teamId },
          update: {
            $set: {
              playedGames: team.playedGames,
              won: team.won,
              draw: team.draw,
              lost: team.lost,
              points: team.points,
              goalsFor: team.goalsFor,
              goalsAgainst: team.goalsAgainst,
              goalDifference: team.goalDifference,
            },
          },
          upsert: true,
        },
      }));

      await Standing.bulkWrite(ops);

      const updatedStandings = await Standing.find({ league: league._id })
        .sort({ points: -1, goalDifference: -1, goalsFor: -1 })
        .populate("team", "name logo")
        .lean();

      const finalStanding = updatedStandings.map((team, index) => ({
        position: index + 1,
        ...team,
      }));

      io.to(`league-${league._id}`).emit("standingsUpdated", finalStanding);
    }
  } catch (err) {
    console.error("Error syncing live standings:", err.message);
  }
}

setInterval(syncLiveStandings, 30000);

module.exports = syncLiveStandings;
