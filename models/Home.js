const mongoose = require("mongoose");

const homeSchema = mongoose.Schema({
  houseName: { type: String, required: true },
  housePrice: { type: Number, required: true },
  homeId: { type: Number, required: true },
});

module.exports = mongoose.model("Home", homeSchema);
