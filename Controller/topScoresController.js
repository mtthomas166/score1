const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const mongoose = require("mongoose");
const TopScores = require("../models/topScoresModel");
exports.createTopScores = catchAsync(async (req, res, next) => {
  const { league } = req.body;
  const existingTopScores = await TopScores.findOne({ league });
  if (existingTopScores) {
    return next(new appError("TopScores for this league already exists", 400));
  }
  const topScores = await TopScores.create(req.body);
  res.status(201).json({
    status: "success",
    data: { topScores },
  });
});
exports.getTopScoresOfLeague = catchAsync(async (req, res, next) => {
  const leagueId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(leagueId))
    return next(new appError("id not valid", 400));
  const topScores = await TopScores.find({ league: leagueId })
    .sort({ goals: -1 })
    .populate("league", "name logo")
    .limit(20)
    .populate({
      path: "player",
      select: "name avatar currentTeam",
      populate: { path: "currentTeam", select: "name" },
    });
  if (!topScores) return next(new appError("not exist", 404));
  const finalTopScores = topScores.map((player, index) => ({
    position: index + 1,
    ...player._doc,
  }));
  res.status(200).json({
    status: "success",
    result: finalTopScores.length,
    data: { topScores: finalTopScores },
  });
});
exports.updateTopScores = catchAsync(async (req, res, next) => {
  const topScoresId = req.params.id;
  if (!topScoresId) return next(new appError("please enter topScoresId", 400));
  if (!mongoose.Types.ObjectId.isValid(topScoresId))
    return next(new appError("id not valid", 400));
  const topScores = await TopScores.findByIdAndUpdate(topScoresId, req.body, {
    new: true,
  })
    .populate("league", "name logo")
    .populate({
      path: "player",
      select: "name avatar currentTeam",
      populate: { path: "currentTeam", select: "name" },
    });
  if (!topScores) return next(new appError("not exist", 404));
  res.status(200).json({
    status: "success",
    data: { topScores },
  });
});
exports.deleteTopScores = catchAsync(async (req, res, next) => {
  const topScoresId = req.params.id;
  if (!topScoresId) return next(new appError("please enter topScoresId", 400));
  if (!mongoose.Types.ObjectId.isValid(topScoresId))
    return next(new appError("id not valid", 400));
  const topScores = await TopScores.findByIdAndDelete(topScoresId);
  if (!topScores) return next(new appError("not exist", 404));
  res.status(200).json({
    status: "success",
    data: null,
  });
});
