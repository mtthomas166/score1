const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
const topScoresController = require("../Controller/topScoresController");
router.use(authController.protect);
router
  .route("/")
  .post(authController.restrict("admin"), topScoresController.createTopScores);
router
  .route("/topScoresOfLeague/:id")
  .get(topScoresController.getTopScoresOfLeague);
router
  .route("/:id")
  .patch(authController.restrict("admin"), topScoresController.updateTopScores)
  .delete(
    authController.restrict("admin"),
    topScoresController.deleteTopScores,
  );
module.exports = router;
