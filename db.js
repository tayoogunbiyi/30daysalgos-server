const { DB_URL } = require("./constants/db");
const mongoose = require("mongoose");

mongoose.set("useCreateIndex", true);

mongoose.connect(DB_URL, { useNewUrlParser: true });

module.exports = { db: mongoose.connection };
