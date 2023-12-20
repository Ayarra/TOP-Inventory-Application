const express = require("express");
const router = express.Router();

// Requiring controllers modules
const shopController = require("../controllers/shopController");

router.get("/", shopController.getAllShops);
router.get("/create", shopController.createShopGet);
router.post("/create", shopController.createShopPost);
router.get("/:id", shopController.getShop);

module.exports = router;
