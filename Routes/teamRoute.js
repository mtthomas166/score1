const express = require("express");
const router = express.Router();
const authController = require("./../Controller/authController");
const teamController = require("./../Controller/teamController");
const { validate } = require("../middleware/validate");
const { teamValidationSchema } = require("../validation/teamValidation");

router.use(authController.protect);

router
  .route("/")
  .get(teamController.getAllTeams)
  .post(
    validate(teamValidationSchema),
    authController.restrict("admin"),
    teamController.createTeam,
  );

router
  .route("/:id")
  .get(teamController.getOneTeam)
  .patch(authController.restrict("admin"), teamController.updateTeam)
  .delete(authController.restrict("admin"), teamController.deleteTeam);

router.route("/informationOfTeam/:id").get(teamController.informationOfTeam);

module.exports = router;
