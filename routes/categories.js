const express = require("express");
const router = express.Router();

// Requiring controllers modules
const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.getAllCategories);
router.get("/create", categoryController.createCategoryGet);
router.post("/create", categoryController.createCategoryPost);
router.get("/:id", categoryController.getCategory);

module.exports = router;
