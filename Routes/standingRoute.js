const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
const standingController = require("../Controller/standingController");
const { validate } = require("../middleware/validate");
const { standingValidation } = require("../validation/standingValidation");
router.use(authController.protect);
router
  .route("/")
  .post(authController.restrict("admin"), standingController.createStanding);
router
  .route("/standingOfLeague/:id")
  .get(standingController.getStandingOfLeague);
router.route("/standingOfTeam/:id").get(standingController.getStandingOfTeam);
router
  .route("/:id")
  .patch(authController.restrict("admin"), standingController.updateStanding)
  .delete(authController.restrict("admin"), standingController.deleteStanding);
module.exports = router;  
