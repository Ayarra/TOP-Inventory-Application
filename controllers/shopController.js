const Shop = require("../models/shop");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.getAllShops = asyncHandler(async (req, res, next) => {
  const allShops = await Shop.find().sort({ name: 1 }).exec();
  res.render("shopList", { title: "Shops List", allShops });
});

exports.getShop = asyncHandler(async (req, res, next) => {
  const shop = Shop.findById(req.params.id).exec();
  res.render("shopDetail", { title: "Shop details", shop });
});

exports.createShopGet = asyncHandler(async (req, res, next) => {
  const allUsers = await User.find().exec();
  res.render("shopForm", { title: "Add new Shop", allUsers });
});

exports.createShopPost = [
  body("shopName", "Shop name must contain at least 3 characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("user", "User can't be empty.").trim().isLength({ min: 1 }),
  body(
    "password",
    "Please enter the password associated to the owner of the shop."
  )
    .trim()
    .isLength({ min: 1 })
    .custom(async (value, { req }) => {
      const user = await User.findById(req.body.user).exec();
      if (value !== user.password) throw new Error("Wrong password!");
    }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const shop = new Shop({
      name: req.body.shopName,
      user: req.body.user,
    });

    if (!errors.isEmpty()) {
      const allUsers = await User.find().exec();
      res.render("shopForm", {
        title: "Add new Shop",
        allUsers,
        errors: errors.array(),
      });
    } else {
      await shop.save();
      res.redirect(shop.url);
    }
  }),
];
