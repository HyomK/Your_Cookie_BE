require("dotenv").config();

const express = require("express");
const quizController = require("../controller/quizController");
const router = express.Router();

router.post("/:token/quiz", quizController.getHostQuiz);
router.post("/:token/register", quizController.registerGuest);
router.post("/comment", quizController.updateComment);
module.exports = router;
