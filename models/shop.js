const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ShopSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

ShopSchema.virtual("url").get(function () {
  return `${this._id}`;
});

module.exports = mongoose.model("Shop", ShopSchema);
