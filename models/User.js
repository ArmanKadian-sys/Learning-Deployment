const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, required: true, enum: ["guest", "host"] },
  fav: [{type:Number}],
  otp: {type: String},
  otpExpire: {type: Number}

});

module.exports = mongoose.model("User", userSchema);
