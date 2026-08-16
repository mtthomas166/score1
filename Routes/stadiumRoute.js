const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
const stadiumController = require("../Controller/stadiumController");
const { validate } = require("../middleware/validate");
const { stadiumValidation } = require("../validation/stadiumValidation");

router.use(authController.protect);
router
  .route("/")
  .post(
    validate(stadiumValidation),
    authController.restrict("admin"),
    stadiumController.createStadium,
  )
  .get(authController.restrict("admin"), stadiumController.getAllStadiums);
router
  .route("/:id")
  .get(stadiumController.getOneStadium)
  .patch(authController.restrict("admin"), stadiumController.updateStadium)
  .delete(authController.restrict("admin"), stadiumController.deleteStadium);
module.exports = router;
