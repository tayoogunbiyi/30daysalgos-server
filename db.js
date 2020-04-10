const { DB_URL } = require("./constants/db");
const mongoose = require("mongoose");

mongoose.set("useCreateIndex", true);
const localUrl = "mongodb://localhost:27017/30days"

mongoose.connect(DB_URL || localUrl, { useNewUrlParser: true });

module.exports = { db: mongoose.connection };
