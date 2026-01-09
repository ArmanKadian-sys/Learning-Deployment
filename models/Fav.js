const mongoose = require("mongoose");

const favSchema = mongoose.Schema({
  homeId: { type: Number, required: true, ref: "Home", unique: true },
});

module.exports = mongoose.model("Fav", favSchema);
