const express = require("express");
const router = express.Router();
const { syncAllLeagues } = require("../Services/espnSync");

router.get("/", async (req, res) => {
  try {
    const total = await syncAllLeagues();
    res.json({
      status: "success",
      message: `Synced ${total} matches from ESPN`,
      total,
      time: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
