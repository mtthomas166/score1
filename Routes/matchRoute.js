const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
const matchController = require("../Controller/matchController");
const { validate } = require("../middleware/validate");
const { matchJoiValidation } = require("../validation/matchValidation");

router.route("/matchesOfLeague/:id").get(matchController.getMatchesInLeague);
router.route("/matchesOfTeam/:id").get(matchController.getMatchOfTeam);
router.route("/:id").get(matchController.getOneMatch);
router.route("/").get(matchController.getAllMatches);

router.use(authController.protect);

router
  .route("/")
  .post(
    validate(matchJoiValidation),
    authController.restrict("admin"),
    matchController.createMatch,
  );

router
  .route("/:id")
  .patch(authController.restrict("admin"), matchController.updateMatch)
  .delete(authController.restrict("admin"), matchController.deleteMatch);

module.exports = router;
