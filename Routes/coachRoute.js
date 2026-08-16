const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
const coachController = require("../Controller/coachController");
const { validate } = require("../middleware/validate");
const { coachValidation } = require("../validation/coachValidation");
router.use(authController.protect);
router
  .route("/")
  .post(
    validate(coachValidation),
    authController.restrict("admin"),
    coachController.createCoach,
  )
  .get(authController.restrict("admin"), coachController.getAllCoaches);
router
  .route("/:id")
  .get(coachController.getOneCoach)
  .patch(authController.restrict("admin"), coachController.updateCoach)
  .delete(authController.restrict("admin"), coachController.deleteCoach);
module.exports = router;
