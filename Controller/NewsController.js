const News = require("../models/newsModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const mongoose = require("mongoose");

exports.createNew = catchAsync(async (req, res, next) => {
  const New = await News.findOne({ title: req.body.title });
  if (New) return next(new appError("new already exist", 400));
  const createdNew = await News.create(req.body);
  res.status(201).json({
    status: "success",
    message: "New created successfully",
    data: { createdNew },
  });
});

exports.getAllNews = catchAsync(async (req, res, next) => {
  const news = await News.find()
    .sort({ createdAt: -1 })
    .select("updatedAt title logo description");
  if (news.length == 0) return next(new appError("not exist any News", 404));
  res.status(200).json({
    status: "success",
    result: news.length,
    data: { news },
  });
});

exports.getOneNew = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return next(new appError("id not valid", 400));
  const New = await News.findById(req.params.id).select(
    "updatedAt title logo description",
  );
  if (!New) return next(new appError("not exist", 404));
  res.status(200).json({
    status: "success",
    data: { New },
  });
});

exports.updateNew = catchAsync(async (req, res, next) => {
  const NewId = req.params.id;
  if (!NewId) return next(new appError("please enter NewId", 400));
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return next(new appError("id not valid", 400));
  const New = await News.findByIdAndUpdate(NewId, req.body, {
    new: true,
  }).select("-updatedAt -__v ");
  if (!New) return next(new appError("not exist", 404));
  res.status(200).json({
    status: "success",
    message: "New updated successfully",
    data: { New },
  });
});

exports.deleteNew = catchAsync(async (req, res, next) => {
  const NewId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return next(new appError("id not valid", 400));
  const New = await News.findByIdAndDelete(NewId);
  if (!New) return next(new appError("not exist", 404));
  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.getNewsOfTeam = catchAsync(async (req, res, next) => {
  const teamId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(teamId))
    return next(new appError("id not valid", 400));
  const news = await News.find({ team: teamId })
    .sort({ createdAt: -1 })
    .select("title logo description updatedAt");
  res.status(200).json({
    status: "success",
    result: news.length,
    data: { news },
  });
});

exports.getNewsOfLeague = catchAsync(async (req, res, next) => {
  const leagueId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(leagueId))
    return next(new appError("id not valid", 400));
  const news = await News.find({ league: leagueId })
    .sort({ createdAt: -1 })
    .select("title logo description updatedAt");
  res.status(200).json({
    status: "success",
    result: news.length,
    data: { news },
  });
});

exports.getNewsOfPlayer = catchAsync(async (req, res, next) => {
  const playerId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(playerId))
    return next(new appError("id not valid", 400));
  const news = await News.find({ player: playerId })
    .sort({ createdAt: -1 })
    .select("title logo description updatedAt");
  res.status(200).json({
    status: "success",
    result: news.length,
    data: { news },
  });
});
