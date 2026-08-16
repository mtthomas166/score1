const axios = require("axios");
const cron = require("node-cron");
const Match = require("../models/matchModel");
const Team = require("../models/teamModel");
const League = require("../models/leagueModel");
const { getIO } = require("../Socket/socket");

class MatchService {
  constructor() {
    this.client = axios.create({
      baseURL: "https://api.football-data.org/v4",
      headers: { "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY },
    })

    setInterval(() => this.updateLiveMatches(), 3600000);

    cron.schedule(
      process.env.DAILY_CRON || "0 0 * * *",
      () => this.dailyFutureMatchesSync(),
      { timezone: "Africa/Cairo" },
    );
  }

  mapApiToMatch(apiMatch) {
    return {
      status: apiMatch.status.toLowerCase(),
      homeTeamGoals: apiMatch.score?.fullTime?.home ?? 0,
      awayTeamGoals: apiMatch.score?.fullTime?.away ?? 0,
      currentMinute: apiMatch.minute ?? 0,
    };
  }

  async dailyFutureMatchesSync() {
    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const after30Days = new Date(today);
      after30Days.setDate(after30Days.getDate() + 30);

      const fromDate = tomorrow.toISOString().split("T")[0];
      const toDate = after30Days.toISOString().split("T")[0];

      const res = await this.client.get(
        `/matches?dateFrom=${fromDate}&dateTo=${toDate}`,
      );

      const matches = res.data.matches || [];
      if (!matches.length) return;

      const teams = await Team.find().lean();
      const leagues = await League.find().lean();

      const teamByApiId = new Map(teams.map((t) => [t.apiId, t]));
      const leagueByApiId = new Map(leagues.map((l) => [l.apiId, l]));

      const ops = [];

      for (const m of matches) {
        const homeTeam = teamByApiId.get(m.homeTeam.id);
        const awayTeam = teamByApiId.get(m.awayTeam.id);
        const league = leagueByApiId.get(m.competition.id);

        if (!homeTeam || !awayTeam || !league) continue;

        ops.push({
          updateOne: {
            filter: { apiId: m.id },
            update: {
              $set: {
                matchDate: m.utcDate,
                status: m.status.toLowerCase(),
              },
              $setOnInsert: {
                apiId: m.id,
                homeTeam: homeTeam._id,
                awayTeam: awayTeam._id,
                league: league._id,
              },
            },
            upsert: true,
          },
        });
      }

      if (ops.length) await Match.bulkWrite(ops);

      console.log(`Daily future sync done: ${ops.length} matches`);
    } catch (err) {
      console.error("dailyFutureMatchesSync error:", err.message);
    }
  }

  async bootstrapUpcomingMatches() {
    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const fromDate = tomorrow.toISOString().split("T")[0];

      const yearFromNow = new Date(today);
      yearFromNow.setFullYear(yearFromNow.getFullYear() + 1);
      const toDate = yearFromNow.toISOString().split("T")[0];

      const res = await this.client.get(
        `/matches?dateFrom=${fromDate}&dateTo=${toDate}`,
      );

      await this.saveMatches(res.data.matches || []);

      console.log(`Bootstrap done from ${fromDate} to ${toDate}`);
    } catch (err) {
      console.error("bootstrapUpcomingMatches error:", err.message);
    }
  }

  async saveMatches(matches) {
    if (!matches.length) return;

    const teams = await Team.find().lean();
    const leagues = await League.find().lean();

    const teamByApiId = new Map(teams.map((t) => [t.apiId, t]));
    const leagueByApiId = new Map(leagues.map((l) => [l.apiId, l]));

    const ops = [];

    for (const m of matches) {
      const homeTeam = teamByApiId.get(m.homeTeam.id);
      const awayTeam = teamByApiId.get(m.awayTeam.id);
      const league = leagueByApiId.get(m.competition.id);

      if (!homeTeam || !awayTeam || !league) continue;

      ops.push({
        updateOne: {
          filter: { apiId: m.id },
          update: {
            $setOnInsert: {
              apiId: m.id,
              homeTeam: homeTeam._id,
              awayTeam: awayTeam._id,
              league: league._id,
              matchDate: m.utcDate,
              status: "scheduled",
              lastUpdated: new Date(),
            },
          },
          upsert: true,
        },
      });
    }

    if (ops.length) await Match.bulkWrite(ops);
  }

  async updateLiveMatches() {
    try {
      const io = getIO();
      const res = await this.client.get("/matches?status=LIVE");
      const liveApiMatches = res.data.matches || [];
      if (!liveApiMatches.length) return;

      const dbMatches = await Match.find({
        apiId: { $in: liveApiMatches.map((m) => m.id) },
      });

      for (const dbMatch of dbMatches) {
        const apiMatch = liveApiMatches.find((m) => m.id === dbMatch.apiId);
        if (!apiMatch) continue;

        const updatedFields = this.mapApiToMatch(apiMatch);

        await Match.updateOne({ _id: dbMatch._id }, { $set: updatedFields });

        // Socket.io Updates
        io.to(`match_${dbMatch._id}`).emit("liveMatchUpdate", {
          matchId: dbMatch._id,
          ...updatedFields,
        });
        io.to(`league_${dbMatch.league}`).emit("leagueMatchUpdate", {
          matchId: dbMatch._id,
          ...updatedFields,
        });
        io.to("homepage").emit("homepageUpdate", {
          matchId: dbMatch._id,
          homeTeamGoals: updatedFields.homeTeamGoals,
          awayTeamGoals: updatedFields.awayTeamGoals,
          status: updatedFields.status,
        });
      }
    } catch (err) {
      console.error("updateLiveMatches error:", err);
    }
  }
}

module.exports = new MatchService();
