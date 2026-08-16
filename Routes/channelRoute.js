const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
const channelController = require("../Controller/channelController");
const {validate} = require('../middleware/validate');
const {createChannelSchema} = require('../validation/channelValidation')
router.use(authController.protect);
router
  .route("/")
  .post(validate(createChannelSchema),authController.restrict("admin"), channelController.createChannel)
  .get(authController.restrict("admin"), channelController.getAllChannels);
router
  .route("/:id")
  .get(channelController.getOneChannel)
  .patch(authController.restrict("admin"), channelController.updateChannel)
  .delete(authController.restrict("admin"), channelController.deleteChannel);
module.exports = router;
 