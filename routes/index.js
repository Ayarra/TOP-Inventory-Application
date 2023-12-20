const express = require("express");
const router = express.Router();

// Require Controllers modules
const itemController = require("../controllers/itemController");

router.get("/", itemController.index);

module.exports = router;
