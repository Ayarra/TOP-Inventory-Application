const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const expressLayouts = require("express-ejs-layouts");

// require routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const categoriesRouter = require("./routes/categories");
const shopsRouter = require("./routes/shops");
const itemsRouter = require("./routes/items");

const app = express();

// database setup
const mongoose = require("mongoose");
const mongoDevUrl =
  "mongodb+srv://insan:insan-insan@cluster0.p37x07g.mongodb.net/inventory_management?retryWrites=true&w=majority";

const mongodb = process.env.MONGODB_URI || mongoDevUrl;
const mongoConnect = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(mongodb);
};
mongoConnect();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "dist")));
app.use(expressLayouts);
app.locals.sortArray = function (a, b) {
  let textA = a.name.toUpperCase();
  let textB = b.name.toUpperCase();
  return textA < textB ? -1 : textA > textB ? 1 : 0;
};

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// defining routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/categories", categoriesRouter);
app.use("/shops", shopsRouter);
app.use("/items", itemsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
