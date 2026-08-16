const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
const playerController = require("../Controller/playerController");
const { validate } = require("../middleware/validate");
const { playerValidation } = require("../validation/playerValidation");

router.use(authController.protect);

router
  .route("/")
  .post(
    validate(playerValidation),
    authController.restrict("admin"),
    playerController.createPlayer,
  )
  .get(playerController.getAllPlayers);

router
  .route("/:id")
  .get(playerController.getOnePlayer)
  .patch(authController.restrict("admin"), playerController.updatePlayer)
  .delete(authController.restrict("admin"), playerController.deletePlayer);

router.route("/playersInTeam/:id").get(playerController.getPlayersInTeam);

module.exports = router;
