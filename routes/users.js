const express = require("express");
const router = express.Router();

// Require Controllers modules
const userController = require("../controllers/userController");

router.get("/", userController.getAllUsers);
router.get("/create", userController.createUserGet);
router.post("/create", userController.createUserPost);
router.get("/:id", userController.getUser);

module.exports = router;
