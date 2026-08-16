const cron = require("node-cron");
const { syncPlayers } = require("./playerServices");

function isTransferWindow() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const isWinter = month === 1;

  const isSummer = month === 7 || month === 8;

  return isWinter || isSummer;
}

async function runTransferSync() {
  if (!isTransferWindow()) {
    console.log(`[${new Date().toISOString()}] Not in transfer window `);
    return;
  }

  try {
    await syncPlayers();
    console.log(`[${new Date().toISOString()}] Players synced successfully`);
  } catch (err) {
    return `playerAsync is failed ${err.message}`;
  }
}

cron.schedule("0 0,12 * * *", runTransferSync);

module.exports = { runTransferSync };  