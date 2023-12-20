const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 300 },
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
});

ItemSchema.virtual("url").get(function () {
  return `${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
