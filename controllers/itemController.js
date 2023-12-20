const Item = require("../models/item");
const Category = require("../models/category");
const User = require("../models/user");
const Shop = require("../models/shop");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  const [userCount, shopCount, categoryCount, itemCount] = await Promise.all([
    User.countDocuments({}).exec(),
    Shop.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
    Item.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Inventory Management Home",
    userCount,
    shopCount,
    categoryCount,
    itemCount,
  });
});

exports.getAllItems = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find().sort({ name: 1 }).exec();
  res.render("itemList", {
    title: "Item List",
    allItems,
  });
});

exports.getItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();

  res.render("itemDetail", { title: "Item detail", item });
});

exports.createItemGet = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().exec();

  res.render("itemForm", { title: "Add new item", allCategories });
});

exports.createItemPost = [
  body("itemName", "Item name must contain at least 3 characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.itemName,
      description: req.body.description,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      const allCategories = await Category.find().exec();
      res.render("itemForm", { title: "Add new item", allCategories });
    } else {
      await item.save();
      res.redirect(item.url);
    }
  }),
];
