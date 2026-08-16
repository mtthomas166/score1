const axios = require("axios");
const Match = require("../models/matchModel");
const Team = require("../models/teamModel");
const League = require("../models/leagueModel");

// leagues to sync - you can add more
const LEAGUES_TO_SYNC = [
  { espn: "eng.1", name: "Premier League", country: "England" },
  { espn: "esp.1", name: "La Liga", country: "Spain" },
  { espn: "ita.1", name: "Serie A", country: "Italy" },
  { espn: "ger.1", name: "Bundesliga", country: "Germany" },
  { espn: "fra.1", name: "Ligue 1", country: "France" },
  { espn: "egy.1", name: "Egyptian Premier League", country: "Egypt" },
];

async function findOrCreateLeague(espnLeagueData, fallback) {
  try {
    let league = await League.findOne({ name: fallback.name });
    if (!league) {
      league = await League.create({
        name: fallback.name,
        country: fallback.country,
        logo: `https://a3.espncdn.com/combiner/i?img=%2Fi%2Fleaguelogos%2Fsoccer%2F500%2F${fallback.espn.split(".")[0]}.png`,
        apiId: Math.floor(Math.random() * 1000000), // temporary if your league needs apiId
      });
    }
    return league;
  } catch (e) {
    console.log("league error", e.message);
    return null;
  }
}

async function findOrCreateTeam(competitor) {
  try {
    const name = competitor.team.displayName || competitor.team.name;
    let team = await Team.findOne({ name });
    if (!team) {
      // try to find by apiId if you have it
      const apiId = parseInt(competitor.id) || Math.floor(Math.random() * 1000000);
      team = await Team.findOne({ apiId }).catch(() => null);
    }
    if (!team) {
      team = await Team.create({
        name: name,
        logo: competitor.team.logo || competitor.team.logos?.[0]?.href || "",
        apiId: parseInt(competitor.id) || Math.floor(Math.random() * 1000000),
      });
    }
    return team;
  } catch (e) {
    console.log("team error", e.message, e);
    return null;
  }
}

function mapStatus(espnStatus) {
  const s = espnStatus?.toLowerCase() || "";
  if (s.includes("final") || s.includes("ft")) return "finished";
  if (s.includes("in progress") || s.includes("live") || s.includes("1h") || s.includes("2h") || s.includes("half")) return "live";
  if (s.includes("postponed")) return "postponed";
  if (s.includes("cancel")) return "cancelled";
  return "scheduled";
}

async function syncOneLeague(leagueConfig) {
  try {
    const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueConfig.espn}/scoreboard`;
    const { data } = await axios.get(url, { timeout: 10000 });
    if (!data.events || data.events.length === 0) {
      console.log(`No events for ${leagueConfig.name}`);
      return 0;
    }

    const leagueDoc = await findOrCreateLeague(data.leagues?.[0], leagueConfig);
    if (!leagueDoc) return 0;

    let count = 0;
    for (const event of data.events) {
      try {
        const comp = event.competitions?.[0];
        if (!comp) continue;
        const competitors = comp.competitors;
        if (!competitors || competitors.length < 2) continue;

        const homeComp = competitors.find(c => c.homeAway === "home") || competitors[0];
        const awayComp = competitors.find(c => c.homeAway === "away") || competitors[1];

        const homeTeamDoc = await findOrCreateTeam(homeComp);
        const awayTeamDoc = await findOrCreateTeam(awayComp);
        if (!homeTeamDoc || !awayTeamDoc) continue;

        const apiId = parseInt(event.id) || parseInt(comp.id) || Date.now() + Math.floor(Math.random()*1000);
        const matchDate = new Date(event.date);
        const status = mapStatus(comp.status?.type?.description || event.status?.type?.description);
        const homeScore = parseInt(homeComp.score) || 0;
        const awayScore = parseInt(awayComp.score) || 0;
        const minute = comp.status?.displayClock ? parseInt(comp.status.displayClock) || 0 : 0;

        await Match.findOneAndUpdate(
          { apiId },
          {
            apiId,
            homeTeam: homeTeamDoc._id,
            awayTeam: awayTeamDoc._id,
            league: leagueDoc._id,
            matchDate,
            homeTeamGoals: homeScore,
            awayTeamGoals: awayScore,
            status,
            currentMinute: minute,
            lastUpdated: new Date(),
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        count++;
      } catch (inner) {
        console.log("event error", inner.message);
      }
    }
    console.log(`Synced ${count} matches for ${leagueConfig.name}`);
    return count;
  } catch (err) {
    console.error(`Failed ${leagueConfig.name}:`, err.message);
    return 0;
  }
}

async function syncAllLeagues() {
  let total = 0;
  for (const lg of LEAGUES_TO_SYNC) {
    const c = await syncOneLeague(lg);
    total += c;
    // small delay to avoid rate limit
    await new Promise(r => setTimeout(r, 500));
  }
  return total;
}

// If required directly, run once
if (require.main === module) {
  syncAllLeagues().then(t => console.log("Done", t));
}

module.exports = { syncAllLeagues, syncOneLeague };
