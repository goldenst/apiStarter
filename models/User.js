const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Add a Name"]
  },
  email: {
    type: String,
    required: [true, "Please Add a Email"],
    unique: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please Enter a Valid Email"
    ]
  },
  role: {
    type: String,
    enum: ["user", "publisher"],
    default: "user"
  },
  password: {
    type: String,
    required: [true, "Please Enter a Password"],
    minlength: 6,
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password
UserSchema.pre("save", async function(next) {
  if(!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign jwt & return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// match user entered  password to hashed pasword in database
UserSchema.methods.matchPassword = async function(enteredpassword) {
  return await bcrypt.compare(enteredpassword, this.password);
};

// Generate and hass password token
UserSchema.methods.getResetPasswordToken = function() {
  // generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hash token and set to resetpassword fiels
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //set expie time
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  console.log(resetToken);
  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
