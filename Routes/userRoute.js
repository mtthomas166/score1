const express = require("express");
const router = express.Router();
const userController = require("./../Controller/userController");
const authController = require("./../Controller/authController");
router.use(authController.protect);
router.route("/me").get(userController.getMe);
router.route("/updateMe").patch(userController.updateMe);
router.route("/deactivateMe").patch(userController.deactiveMe);
router
  .route("/users")
  .get(authController.restrict("admin"), userController.GetAllUsers);
router
  .route("/oneUser/:id")
  .get(authController.restrict("admin"), userController.getOneUser);
router
  .route("/deleteUser")
  .delete(authController.restrict("admin"), userController.deleteUser);
(router
  .route("/favoriteLeagues/:leagueId")
  .patch(userController.addFavoriteLeague)
  .delete(userController.deleteFromFavoriteLeague),
  router.route("/favoriteLeagues").get(userController.getAllFavoriteLeagues));
router
  .route("/hiddenLeagues/:leagueId")
  .patch(userController.addedToHiddenLeagues)
  .delete(userController.removeFromHidden);
router.route("/hiddenLeagues").get(userController.getAllHiddenLeagues);
module.exports = router;
