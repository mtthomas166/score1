const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
const refereeController = require("../Controller/refereeController");
const { validate } = require("../middleware/validate");
const { refereeJoiSchema } = require("../validation/refreeValidation");

router.use(authController.protect);
router
  .route("/")
  .post(
    validate(refereeJoiSchema),
    authController.restrict("admin"),
    refereeController.createReferee,
  )
  .get(authController.restrict("admin"), refereeController.getAllReferees);
router
  .route("/:id")
  .get(refereeController.getOneReferee)
  .patch(authController.restrict("admin"), refereeController.updateReferee)
  .delete(authController.restrict("admin"), refereeController.deleteReferee);
router
  .route("/refereesInCountry/:id")
  .get(
    authController.restrict("admin"),
    refereeController.getRefereesInCountry,
  );
module.exports = router;
