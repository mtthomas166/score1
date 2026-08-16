const Match = require("./../models/matchModel");
const catchAsync = require("./../utils/catchAsync");
const appError = require("./../utils/appError");
const mongoose = require('mongoose');

const populateOptions = [
  { path: "homeTeam", select: "name logo" },
  { path: "awayTeam", select: "name logo" },
  { path: "league", select: "name logo" },
];

exports.createMatch = catchAsync(async (req, res, next) => {
  const match = await Match.find({
    homeTeam: req.body.homeTeam,
    matchDate: req.body.matchDate,
  });
  if (match.length > 0) return next(new appError("match already exist"));
  const newMatch = await Match.create(req.body);
  res.status(201).json({
    status: "success",
    message: "match created successfully",
    data: { newMatch },
  });
});

exports.getAllMatches = catchAsync(async (req, res, next) => {
  const matches = await Match.find().populate(populateOptions);
  if (matches.length == 0) return next(new appError("no matches exist"));
  res.status(200).json({
    status: "success",
    data: { matches },
  });
});

exports.getOneMatch = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return next(new appError("id not valid", 400));
  const match = await Match.findById(req.params.id).populate(populateOptions);
  if (!match) return next(new appError("match not exist", 404));
  res.status(200).json({
    status: "success",
    data: { match },
  });
});

exports.updateMatch = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return next(new appError("id not valid", 400));
  const match = await Match.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate(populateOptions);
  if (!match) return next(new appError("match not exist", 404));
  res.status(200).json({
    status: "success",
    message: "match updated successfully",
    data: { match },
  });
});

exports.deleteMatch = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return next(new appError("id not valid", 400));
  const match = await Match.findByIdAndDelete(req.params.id);
  if (!match) return next(new appError("match not exist", 404));
  res.status(204).json({
    status: "success",
    message: "match deleted successfully",
    data: null,
  });
});

exports.getMatchesInLeague = catchAsync(async (req, res, next) => {
  const league = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(league))
    return next(new appError("id not valid", 400));
  const matches = await Match.find({ league: league }).populate(
    populateOptions,
  );
  if (matches.length == 0) return next(new appError("no match in the league"));
  res.status(200).json({
    status: "success",
    data: { matches },
  });
});

exports.getMatchOfTeam = catchAsync(async (req, res, next) => {
  const team = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(team))
    return next(new appError("id not valid", 400));
  const matches = await Match.find({
    $or: [{ homeTeam: team }, { awayTeam: team }],
  }).populate(populateOptions);
  if (matches.length == 0) return next(new appError("no match for this team"));
  res.status(200).json({
    status: "success",
    data: { matches },
  });
});

