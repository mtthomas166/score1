const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
const transferController = require("../Controller/transferController");
router.use(authController.protect);
router
  .route("/")
  .post(authController.restrict("admin"), transferController.createTransfer)
  .get(transferController.getAllTransfer);
router
  .route("/:id")
  .get(transferController.getOneTransfer)
  .patch(authController.restrict("admin"), transferController.updateTransfer)
  .delete(authController.restrict("admin"), transferController.deleteTransfer);
router.route("/transferOfTeam/:id").get(transferController.getTransferOfTeam);
router
  .route("/transferOfPlayer/:id")
  .get(transferController.getTransferOfPlayer);
module.exports = router;
