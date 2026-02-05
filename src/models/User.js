const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:String,
  email:String,
  password:String,
  provider:String
});

module.exports = mongoose.model("User", userSchema);
