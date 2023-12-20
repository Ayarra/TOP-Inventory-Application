const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Requiring all modals
const User = require("../models/user");
const Shop = require("../models/shop");

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const [allUsers, allShops] = await Promise.all([
    User.find().sort({ name: 1 }).exec(),
  ]);
  res.render("usersList", {
    title: "Users List",
    allUsers,
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const [user, userShops] = await Promise.all([
    User.findById(req.params.id).sort({ name: 1 }).exec(),
    Shop.find({ user: req.params.id }, "name").exec(),
  ]);
  res.render("userDetail", {
    title: "User detail",
    user,
    userShops,
  });
});

exports.createUserGet = (req, res, next) => {
  res.render("userForm", { title: "Create new user" });
};

exports.createUserPost = [
  body("name", "User name must contain at least 3 characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("password")
    .isStrongPassword({
      minLength: 7,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 1,
    })
    .withMessage(
      "Password must be at least 7 characters long, conatian at least 1 uppercase character, 1 numeric character, and 1 symbol."
    ),
  body("shopName", "Shop name must contain at least 3 characters."),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      name: req.body.name,
      password: req.body.password,
    });
    const shop = new Shop({
      name: req.body.shopName,
      user: user._id,
    });

    if (!errors.isEmpty()) {
      res.render("userForm", {
        title: "Create new user",
        user,
        errors: errors.array(),
      });
    } else {
      await Promise.all([user.save(), shop.save()]);
      res.redirect(user.url);
    }
  }),
];
