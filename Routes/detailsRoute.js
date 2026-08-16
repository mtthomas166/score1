const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
const detailsController = require("../Controller/detailsOfMatchController");
const { validate } = require("../middleware/validate");
const { detailsJoiSchema } = require("../validation/detailsOfMatchValidation");
router.use(authController.protect);
router
  .route("/")
  .post(
    validate(detailsJoiSchema),
    authController.restrict("admin"),
    detailsController.createDetails,
  )
  .get(authController.restrict("admin"), detailsController.getAllDetails);
router
  .route("/:id")
  .get(detailsController.getOneDetails)
  .patch(authController.restrict("admin"), detailsController.updateDetails)
  .delete(authController.restrict("admin"), detailsController.deleteDetails);
module.exports = router;
