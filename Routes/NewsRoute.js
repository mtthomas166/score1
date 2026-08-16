const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
const NewsController = require("../Controller/NewsController");
const { validate } = require("../middleware/validate");
const { newJoiValidation } = require("../validation/newValidation");

router.use(authController.protect);

router
  .route("/")
  .post(
    validate(newJoiValidation),
    authController.restrict("admin"),
    NewsController.createNew,
  )
  .get(NewsController.getAllNews);

router
  .route("/:id")
  .get(NewsController.getOneNew)
  .patch(authController.restrict("admin"), NewsController.updateNew)
  .delete(authController.restrict("admin"), NewsController.deleteNew);

router.route("/newsOfTeam/:id").get(NewsController.getNewsOfTeam);

router.route("/newsOfLeague/:id").get(NewsController.getNewsOfLeague);

router.route("/newsOfPlayer/:id").get(NewsController.getNewsOfPlayer);

module.exports = router;
