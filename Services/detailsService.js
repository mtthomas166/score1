const axios = require("axios");
const cron = require("node-cron");
const Details = require("./../models/detailsOfMatch");
const { getIO } = require("../Socket/socket");
const options = {
  method: "GET",
  url: "https://free-api-live-football-data.p.rapidapi.com/football-players-search",
  params: { search: "m" },
  headers: {
    "x-rapidapi-host": process.env.x_rapidapi_host,
    "x-rapidapi-key": process.env.x_rapidapi_key,
  },
};

class DetailsServices {
  constructor() {
    this.client = axios.create(options);
    cron.schedule("0 0,12 * * *", () => this.dailyFutureDetailsSync(), {
      timezone: "Africa/Cairo",
    });
  }

  mapApiToMatch(apiMatch) {
    return {
      status: apiMatch.status.toLowerCase(),
      stadium: apiMatch.stadium,
      round: apiMatch.round,
      channel: apiMatch.channel,
      referee: apiMatch.referee,
      commentator: apiMatch.commentator,
      data: apiMatch.date,
      matchTime: apiMatch.matchTime,
    };
  }
  async dailyFutureDetailsSync() {
    try {
      const io = getIO();
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const after30Days = new Date(today);
      after30Days.setDate(after30Days.getDate() + 30);

      const fromDate = tomorrow.toISOString().split("T")[0];
      const toDate = after30Days.toISOString().split("T")[0];

      const res = await this.client.get(
        `/details?dateFrom=${fromDate}&dateTo=${toDate}`,
      );

      const detailsOfMatches = res.data.matches || [];
      if (!detailsOfMatches.length) return;

      const ops = [];

      for (const m of detailsOfMatches) {
        ops.push({
          updateOne: {
            filter: { apiId: m.id },
            update: {
              $set: this.mapApiToMatch(m),
              $setOnInsert: this.mapApiToMatch(m),
            },
            upsert: true,
          },
        });
      }

      if (ops.length) await Details.bulkWrite(ops);

      const matchesData = detailsOfMatches.map((m) => this.mapApiToMatch(m));
      io.to("match_details").emit("detailsOfMatch", matchesData);
    } catch (err) {
      console.error("dailyFutureMatchesSync error:", err.message);
    }
  }
}
