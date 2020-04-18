/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
const mongoose = require("mongoose");

const { Schema } = mongoose;

const LeaderboardSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  points: {
    type: Number,
    required: true,
  },
});

LeaderboardSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj["__v "];
  return obj;
};

LeaderboardSchema.statics.updateUserPoints = async function (userId, points) {
  const userPointMapping = await this.findOne({ userId });
  if (!userPointMapping) {
    const newUserPointMapping = new this();
    newUserPointMapping.userId = userId;
    newUserPointMapping.points = points;
    await newUserPointMapping.save();
    return points;
  }
  userPointMapping.points += points;
  await userPointMapping.save();
  return userPointMapping.points;
};

LeaderboardSchema.statics.sortAndSave = async function () {
  try {
    const leaderboard = await LeaderboardSchema.find({}).sort("points");
    this.save(leaderboard);
  } catch (error) {
    return null;
  }
};

module.exports = mongoose.model("Leaderboard", LeaderboardSchema);
