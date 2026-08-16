const catchAsync = require("./../utils/catchAsync");
const appError = require("./../utils/appError");
const User = require("./../models/userModel");

const filterRequestBody = (requestBody, ...allowedFieldToUpdate) => {
  const finalObject = {};
  Object.keys(requestBody).forEach((el) => {
    if (allowedFieldToUpdate.includes(el)) finalObject[el] = requestBody[el];
  });
  return finalObject;
};

//getMe
exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    status: "success",
    data: { user },
  });
});

//add To FavoriteLeagues
exports.addFavoriteLeague = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new appError("please signUp", 404));
  const favoriteLeague = req.params.leagueId;
  if (!favoriteLeague) return next(new appError("enter favoriteLeagueId", 400));
  hiddens = user.hiddenLeagues.map((id) => id.tostring());
  if (hiddens.includes(favoriteLeague))
    return next(new appError("make it unhidden first", 401));
  await User.findByIdAndUpdate(
    req.user.id,
    { $addToSet: { favoriteLeagues: favoriteLeague } },
    {
      new: true,
      runValidators: true,
    }
  ).populate("favoriteLeagues", "name avatar");
  res.status(200).json({
    status: "success",
    message: "added to favorite successfully",
    data: { favoriteLeague: user.favoriteLeagues },
  });
});

//get All Favorite Leagues
exports.getAllFavoriteLeagues = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new appError("please signUp", 401));
  await user.populate("favoriteLeagues", "name logo");
  res.status(200).json({
    status: "success",
    result: user.favoriteLeagues.length,
    data: { favoriteLeagues: user.favoriteLeagues },
  });
});

//deleted From Favorite Leagues
exports.deleteFromFavoriteLeague = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new appError("please sign up", 401));
  const favoriteLeague = req.params.leagueId;
  if (!favoriteLeague) return next(new appError("enter favoriteLeagueId", 400));
  await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { favoriteLeagues: favoriteLeague } },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: "league removed from favorite successfully",
    data:{ hiddenLeague:user.favoriteLeagues},
  });
});

//added To Hidden Leagues
exports.addedToHiddenLeagues = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new appError("please signUp", 401));
  const hiddenLeague = req.params.leagueId;
  if (!hiddenLeague) return next(new appError("enter hiddenLeague Id", 400));
  await User.findByIdAndUpdate(
    req.user.id,
    {
      $addToSet: { hiddenLeagues: hiddenLeague  },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: "league is hidden",
    data:{hiddenLeagues: user.hiddenLeagues}
  });
});

//get All Hidden Leagues
exports.getAllHiddenLeagues = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new appError("please signUp", 401));
  await user.populate("hiddenLeagues", "name logo");
  res.status(200).json({
    status: "success",
    result: user.hiddenLeagues.length,
    data: { hiddenLeagues: user.hiddenLeagues },
  });
});

//delete from hiddenLeagues
exports.removeFromHidden = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new appError("please signUp", 401));
  const hiddenLeague = req.params.id;
  await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { hiddenLeagues: hiddenLeague } },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: "success",
    message: "league is unhidden",
  });
});

//updateMe
exports.updateMe = catchAsync(async (req, res, next) => {
  const filterBody = filterRequestBody(req.body, "name", "photo");
  for (let x in req.body) {
    if (!Object.hasOwn(filterBody, x))
      return next(new appError("not allowed", 400));
  }
  const user = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: { user },
  });
});

//account deactive
exports.deactiveMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { active: false },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: "account is deactivated",
  });
});

//getAllUsers
exports.GetAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    data: { users },
  });
});

//getOneUser
exports.getOneUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new appError("not user exist", 404));
  res.status(200).json({
    status: "success",
    data: { user },
  });
});

//deleteUser
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.user.id);
  res.status(204).send();
});
