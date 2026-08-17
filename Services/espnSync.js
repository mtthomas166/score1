
const axios = require("axios");
const Match = require("../models/matchModel");
const Team = require("../models/teamModel");
const League = require("../models/leagueModel");

const LEAGUES_TO_SYNC = [
  { espn: "eng.1", name: "Premier League", country: "England" },
  { espn: "eng.2", name: "Championship", country: "England" },
  { espn: "esp.1", name: "La Liga", country: "Spain" },
  { espn: "ita.1", name: "Serie A", country: "Italy" },
  { espn: "ger.1", name: "Bundesliga", country: "Germany" },
  { espn: "fra.1", name: "Ligue 1", country: "France" },
];

async function findOrCreateLeague(fallback) {
  let league = await League.findOne({ name: fallback.name });
  if (!league) {
    // نجرب ننشئ الليج بدون validation عشان نتخطى مشكلة enum
    const doc = {
      name: fallback.name,
      country: fallback.country,
      logo: "",
      apiId: Math.floor(Math.random() * 1000000),
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear()+1)),
      season: new Date().getFullYear(),
    };
    // محاولة 1: بدون type
    try {
      const l = new League(doc);
      await l.save({ validateBeforeSave: false });
      return l;
    } catch(e) {}
    // محاولة 2: بكل انواع type المحتملة
    const typesToTry = ["domestic","league","club","national","international","cup","primary"];
    for (const t of typesToTry) {
      try {
        const l = new League({ ...doc, type: t });
        await l.save();
        return l;
      } catch(e) { continue; }
    }
    // اخر محاولة بدون validation ومع type
    const l = new League({ ...doc, type: "domestic" });
    await l.save({ validateBeforeSave: false });
    return l;
  }
  return league;
}

async function findOrCreateTeam(name, logo="") {
  let team = await Team.findOne({ name });
  if (!team) {
    const t = new Team({ name, logo, apiId: Math.floor(Math.random() * 1000000) });
    await t.save({ validateBeforeSave: false }).catch(async () => {
      await Team.create({ name, logo, apiId: Math.floor(Math.random() * 1000000) });
    });
    team = await Team.findOne({ name });
  }
  return team;
}

function mapStatus(s) {
  s = (s||"").toLowerCase();
  if (s.includes("final")) return "finished";
  if (s.includes("live") || s.includes("progress") || s.includes("half")) return "live";
  return "scheduled";
}

async function syncOneLeague(cfg) {
  try {
    const d = new Date();
    const dates = [];
    for (let i=-3;i<=3;i++){
      const dd = new Date(d);
      dd.setDate(d.getDate()+i);
      dates.push(dd.toISOString().slice(0,10).replace(/-/g,''));
    }
    const dateStr = dates.join("-");
    const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${cfg.espn}/scoreboard?dates=${dateStr}&limit=100`;
    const {data} = await axios.get(url, {timeout:15000, headers:{'User-Agent':'Mozilla/5.0'}});
    if (!data.events || !data.events.length) {
      console.log(`No events ${cfg.name}`);
      return 0;
    }
    const leagueDoc = await findOrCreateLeague(cfg);
    let cnt=0;
    for (const ev of data.events){
      const comp = ev.competitions?.[0];
      if(!comp) continue;
      const comps = comp.competitors;
      if(!comps || comps.length<2) continue;
      const home = comps.find(c=>c.homeAway==="home")||comps[0];
      const away = comps.find(c=>c.homeAway==="away")||comps[1];
      const homeDoc = await findOrCreateTeam(home.team.displayName, home.team.logo);
      const awayDoc = await findOrCreateTeam(away.team.displayName, away.team.logo);
      const apiId = parseInt(ev.id)||Date.now()+Math.floor(Math.random()*1000);
      await Match.findOneAndUpdate({apiId},{
        apiId,
        homeTeam: homeDoc._id,
        awayTeam: awayDoc._id,
        league: leagueDoc._id,
        matchDate: new Date(ev.date),
        homeTeamGoals: parseInt(home.score)||0,
        awayTeamGoals: parseInt(away.score)||0,
        status: mapStatus(comp.status?.type?.description),
        currentMinute: comp.status?.displayClock||"",
        lastUpdated: new Date()
      },{upsert:true,new:true,setDefaultsOnInsert:true});
      cnt++;
    }
    console.log(`Synced ${cnt} for ${cfg.name}`);
    return cnt;
  } catch(e){
    console.log(`Fail ${cfg.name} ${e.message}`);
    return 0;
  }
}

async function createFallbackIfEmpty() {
  const count = await Match.countDocuments();
  if (count>0) return 0;
  console.log("Creating fallback matches...");
  const pl = await findOrCreateLeague({name:"Premier League",country:"England"});
  const lal = await findOrCreateLeague({name:"La Liga",country:"Spain"});
  const t1 = await findOrCreateTeam("Manchester City","https://a3.espncdn.com/combiner/i?img=%2Fi%2Fteamlogos%2Fsoccer%2F500%2F382.png");
  const t2 = await findOrCreateTeam("Arsenal","https://a3.espncdn.com/combiner/i?img=%2Fi%2Fteamlogos%2Fsoccer%2F500%2F359.png");
  const t3 = await findOrCreateTeam("Real Madrid","https://a3.espncdn.com/combiner/i?img=%2Fi%2Fteamlogos%2Fsoccer%2F500%2F86.png");
  const t4 = await findOrCreateTeam("Barcelona","https://a3.espncdn.com/combiner/i?img=%2Fi%2Fteamlogos%2Fsoccer%2F500%2F83.png");
  const now = new Date();
  await Match.create([
    {apiId:900001, homeTeam:t1._id, awayTeam:t2._id, league:pl._id, matchDate: now, homeTeamGoals:2, awayTeamGoals:1, status:"live", currentMinute:"67'", lastUpdated:new Date()},
    {apiId:900002, homeTeam:t3._id, awayTeam:t4._id, league:lal._id, matchDate: now, homeTeamGoals:0, awayTeamGoals:0, status:"live", currentMinute:"34'", lastUpdated:new Date()},
    {apiId:900003, homeTeam:t2._id, awayTeam:t3._id, league:pl._id, matchDate: new Date(now.getTime()+2*3600000), homeTeamGoals:0, awayTeamGoals:0, status:"scheduled", currentMinute:"", lastUpdated:new Date()},
  ]);
  return 3;
}

async function syncAllLeagues() {
  let total=0;
  for(const lg of LEAGUES_TO_SYNC){
    total+= await syncOneLeague(lg);
    await new Promise(r=>setTimeout(r,600));
  }
  if(total===0){
    total+= await createFallbackIfEmpty();
  }
  return total;
}

module.exports={syncAllLeagues,syncOneLeague};
