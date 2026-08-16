const express = require('express');
const router = express.Router();
const Match = require('../models/matchModel');

router.get('/', async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('homeTeam')
      .populate('awayTeam')
      .populate('league')
      .sort({ matchDate: -1 })
      .limit(50);
    res.json({ status: 'success', total: matches.length, matches });
  } catch (err) {
    console.error('matchRoute error:', err.message);
    // لو حصل ايرور رجع array فاضي بدل 500 عشان الفرونت ميقعش
    res.json({ status: 'success', total: 0, matches: [], error: err.message });
  }
});

module.exports = router;
