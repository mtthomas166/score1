const Channel = require('../models/channelModel')
const api = require('../Services/soccersApi');


async function syncAllChannels() {
  try {
    const res = await api.get("broadcast/");
    const channelsData = res.data.data || [];

    if (!channelsData.length) {
      console.log("not exist any channel");
      return;
    }

    const ops = channelsData.map((chan) => ({
      updateOne: {
        filter: { name: chan.name },
        update: {
          $set: {
            name: chan.name,
            satellite: chan.satellite || "Unknown",
            corner: chan.corner || "Unknown",
            frequency: chan.frequency || 0,
            polarization: chan.polarization || "H",
            coding: chan.coding || "Unknown",
            correction: chan.correction || "Unknown",
            encryption: chan.encryption || "FTA",
            language: chan.language || "Unknown",
          },
        },
        upsert: true,
      },
    }));

    await Channel.bulkWrite(ops);
    
  } catch (err) {
    console.error("syncAllChannels error:", err.message);
  }
}

syncAllChannels();
