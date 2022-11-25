require("dotenv").config();

const express = require("express");
const hostController = require("../controller/hostController");
const router = express.Router();

router.post("/register", hostController.registerHost);
router.post("/login", hostController.findUserByInfo);
router.post("/validation", hostController.findUserByToken);
router.post("/:token/cookie", hostController.setHostCookie);
router.post("/:token/quiz", hostController.createQuiz);
router.get("/:token/cookies", hostController.getGuestAnswer);
module.exports = router;
