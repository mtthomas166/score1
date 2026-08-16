const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
const matchController = require("../Controller/matchController");
const { validate } = require("../middleware/validate");
const { matchJoiValidation } = require("../validation/matchValidation");
router.use(authController.protect);

router
  .route("/")
  .post(
    validate(matchJoiValidation),
    authController.restrict("admin"),
    matchController.createMatch,
  )
  .get(authController.restrict("admin"), matchController.getAllMatches);

router
  .route("/:id")
  .get(matchController.getOneMatch)
  .patch(authController.restrict("admin"), matchController.updateMatch)
  .delete(authController.restrict("admin"), matchController.deleteMatch);

router("/matchesOfLeague/:id").get(matchController.getMatchesInLeague);

router("/matchesOfTeam/:id").get(matchController.getMatchOfTeam);

module.exports = router;
