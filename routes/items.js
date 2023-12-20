const express = require("express");
const router = express.Router();

// Requiring controllers modules
const itemController = require("../controllers/itemController");

router.get("/", itemController.getAllItems);
router.get("/create", itemController.createItemGet);
router.post("/create", itemController.createItemPost);
router.get("/:id", itemController.getItem);

module.exports = router;
