/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
});

UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  const fieldsToDelete = [
    "password",
    "__v ",
    "active",
  ];
  fieldsToDelete.forEach(field => {
    delete obj[field];
  });
  return obj;
};

UserSchema.statics.generateHash = async password => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (e) {
    return null;
  }
};

UserSchema.methods.generateJWT = async function(password) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    if (!isMatch) {
      return null;
    }
    const payload = { id: this._id };
    const token = await jwt.sign(payload, process.env.SECRET  || 'secret!?' , {
      expiresIn: process.env.expiresIn || 36000
    });
    return token;
  } catch (error) {
    return null;
  }
};

UserSchema.methods.generateOauthJWT = async function() {
  try {
    const payload = { id: this._id };
    const token = await jwt.sign(payload, process.env.SECRET  || 'secret!?' , {
      expiresIn: process.env.expiresIn || 36000
    });
    return token;

  } catch (error) {
    return null
  }
}

UserSchema.methods.verifyJWT = async function(token) {
  try {
    const isMatch = await jwt.verify(token, process.env.SECRET || "secret!?");
    return isMatch
  } catch (error) {
    return null;
  }
}

module.exports = mongoose.model("User", UserSchema);
