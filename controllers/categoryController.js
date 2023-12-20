const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.getAllCategories = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render("categoryList", {
    title: "Category List",
    allCategories,
  });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  const [category] = await Promise.all([
    Category.findById(req.params.id).exec(),
  ]);

  res.render("categoryDetail", { title: "Category Detail", category });
});

exports.createCategoryGet = (req, res, next) => {
  res.render("categoryForm", { title: "Create new category" });
};

exports.createCategoryPost = [
  body("name", "Category must contain at least 2 characters.")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render("categoryForm", {
        title: "Create new category",
        category,
        errors: errors.array(),
      });
      return;
    } else {
      const categoryExists = await Category.findOne({
        name: req.body.name,
      }).exec();
      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        res.redirect(category.url);
      }
    }
  }),
];
