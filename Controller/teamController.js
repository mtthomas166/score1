const Team = require("./../models/teamModel");
const catchAsync = require("./../utils/catchAsync");
const appError = require("./../utils/appError");
const User = require("../models/userModel");
const News = require("../models/newsModel");
const Player = require("./../models/playerModel");
const { options } = require("../app");

exports.createTeam = catchAsync(async (req, res, next) => {
  const team = await Team.findOne({ name: req.body.name });
  if (team) return next(new appError("team already exist", 400));
  const newTeam = await Team.create(req.body);
  res.status(201).json({
    status: "success",
    message: "team created Successfully",
    data: { newTeam },
  });
});

//Get All Teams
exports.getAllTeams = catchAsync(async (req, res, next) => {
  const teams = await Team.find();
  if (teams.length == 0) return next(new appError("not exist any team", 404));
  res.status(200).json({
    status: "success",
    result: teams.length,
    data: { teams },
  });
});

//Get One Team By Id
exports.getOneTeam = catchAsync(async (req, res, next) => {
  const teamId = req.params.id;
  if (!teamId) return next(new appError("please enter teamId", 400));
  if (!mongoose.Types.ObjectId.isValid(teamId))
    return next(new appError("id not valid", 400));
  const team = await Team.findById(teamId);
  if (!team) return next(new appError("not exist", 404));
  res.status(200).json({
    status: "success",
    data: { team },
  });
});

//Update Team By Admin
exports.updateTeam = catchAsync(async (req, res, next) => {
  const teamId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(teamId))
    return next(new appError("id not valid", 400));
  const team = await Team.findByIdAndUpdate(teamId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!team) return next(new appError("not exist", 404));
  res.status(200).json({
    status: "success",
    message: "team updated successfully",
    data: { team },
  });
});

//Delete Team By Admin
exports.deleteTeam = catchAsync(async (req, res, next) => {
  const teamId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(teamId))
    return next(new appError("id not valid", 400));
  const team = await Team.findByIdAndDelete(teamId);
  if (!team) return next(new appError("not exist", 404));
  res.status(204).json({
    status: "success",
    data: null,
  });
});

//Get Information Of Team
exports.informationOfTeam = catchAsync(async (req, res, next) => {
  const teamId = req.params.id;
  if (!teamId) return next(new appError("please enter teamId", 400));
  const team = await Team.findById(teamId)
    .populate({
      path: "information.country",
      select: "name logo",
    })
    .populate({
      path: "information.stadium",
      select: "name",
    });
  if (!team) return next(new appError("not exist", 404));
  res.status(200).json({
    status: "success",
    data: { information: team.information },
  });
});
