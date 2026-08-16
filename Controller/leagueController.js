const League = require("../models/leagueModel");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Team = require("../models/teamModel");
const { default: mongoose } = require("mongoose");

const leaguesInHomePage = async (user) => {
  const leagues = await League.find({
    name: {
      $in: [
        "Premier League",
        "La Liga",
        "Serie A",
        "Bundesliga",
        "Ligue 1",
        "UEFA Champions League",
        "CAF Champions League",
        "AFC Champions League",
        "Copa Libertadores",
        "World Cup",
      ],
    },
    _id: { $nin: user.hiddenLeagues },
  });

  await Promise.all(
    user.favoriteLeagues.map(async (league) => {
      let exist = false;
      for (let i = 0; i < leagues.length; i++) {
        if (leagues[i]._id.toString() == league.toString()) {
          exist = true;
          break;
        }
      }
      if (!exist && !user.hiddenLeagues.includes(league)) {
        const favoriteLeague = await League.findById(league);
        leagues.push(favoriteLeague);
      }
    }),
  );
  const leaguesId = leagues.map((league) => league._id);
  user.homeLeaguesOrder = leaguesId;
  await user.save();
  return leagues;
};

//Create League
exports.createLeague = catchAsync(async (req, res, next) => {
  const league = await League.findOne({ name: req.body.name });
  if (league) return next(new AppError("league already exist"));
  const newLeague = await League.create(req.body);
  res.status(201).json({
    status: "success",
    message: "league created sucessfully",
    data: { league },
  });
});

exports.getAllLeagues = catchAsync(async (req, res, next) => {
  const leagues = await League.find();
  res.status(200).json({
    status: "success",
    result: leagues.length,
    data: { leagues },
  });
});

//Get All Leagues For User
exports.getAllLeaguesforUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const leagues = await League.find({ _id: { $nin: user.hiddenLeagues } });
  res.status(200).json({
    status: "success",
    result: leagues.length,
    data: { leagues },
  });
});

//Home Page
exports.getHomePage = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError("please signUp", 401));
  let leagues;
  if (user.homeLeaguesOrder && user.homeLeaguesOrder.length > 0) {
    let populateUser = await User.findById(req.user.id).populate(
      "homeLeaguesOrder",
    );
    leagues = populateUser.homeLeaguesOrder;
  } else {
    leagues = await leaguesInHomePage(user);
  }
  res.status(200).json({
    status: "success",
    result: leagues.length,
    data: { leagues },
  });
});

//ordering Home Page
exports.orderLeagueInHomePage = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError("please signUp", 401));
  const { leagueId, order } = req.body;
  if (!leagueId || !order)
    return next(new AppError("please enter leagueId and order"));
  if (order !== "top" && order !== "bottom")
    return next(new AppError("order must be top or bottom"));
  let leagues = await leaguesInHomePage(user);
  const leaguesId = leagues.map((league) => league._id.toString());
  if (!leaguesId.includes(leagueId))
    return next(
      new AppError("this options are available to leagues in home page", 400),
    );
  leagues = leagues.filter(
    (league) => league._id.toString() !== leagueId.toString(),
  );
  const league = await League.findById(leagueId);
  if (!league) return next(new AppError("league is not exist", 400));
  if (order == "top") leagues.unshift(league);
  else leagues.push(league);
  const leaguesIds = leagues.map((league) => league._id);
  user.homeLeaguesOrder = leaguesIds;
  await user.save();
  res.status(200).json({
    status: "success",
    result: leagues.length,
    data: { leagues },
  });
});

// Update League
exports.updateLeague = catchAsync(async (req, res, next) => {
  const leagueId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(leagueId))
    return next(new appError("id not valid", 400));
  const updateLeague = await League.findByIdAndUpdate(leagueId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updateLeague) next(new AppError(`this league doesn't exist`, 404));

  res.status(200).json({
    status: "success",
    message: "league updated successfully",
    data: { updateLeague },
  });
});

//Delete League
exports.deleteLeague = catchAsync(async (req, res, next) => {
  const leagueId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(leagueId))
    return next(new appError("id not valid", 400));
  const deletedLeague = await League.findByIdAndDelete(leagueId);

  if (!deletedLeague) next(new AppError(`this league doesn't exist`, 404));

  res.status(204).json({
    status: "success",
    data: null,
  });
});
