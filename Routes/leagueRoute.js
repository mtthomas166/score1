const express = require("express");
const router = express.Router();
const leagueController = require("./../Controller/leagueController");
const authController = require("./../Controller/authController");
const { validate } = require("../middleware/validate");
const { leagueJoiSchema } = require("./../validation/leagueValidation");

router.use(authController.protect);
router
  .route("/")
  .post(
    validate(leagueJoiSchema),
    authController.restrict("admin"),
    leagueController.createLeague,
  )
  .get(authController.restrict("admin"), leagueController.getAllLeagues);
router.route("/leaguesOfUser").get(leagueController.getAllLeaguesforUser);
router.route("/homePage").get(leagueController.getHomePage);
router.route("/homePageInOrder").get(leagueController.orderLeagueInHomePage);
router
  .route("/updateLeague")
  .patch(authController.restrict("admin"), leagueController.updateLeague);
router
  .route("/deleteLeague")
  .delete(authController.restrict("admin"), leagueController.deleteLeague);
module.exports = router;
