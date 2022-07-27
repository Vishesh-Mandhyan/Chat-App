const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isAvatarImageSet: { type: Boolean, default: false },
  avatarImage: { type: String, default: "" },
});

module.exports = mongoose.model("users", userSchema);
