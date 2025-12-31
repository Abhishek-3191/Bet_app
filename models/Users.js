const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true,unique:true },
  name: { type: String },
  role: {type: String,default: 'user'},
  points: { type: Number, default: 1000 } // signup bonus
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
