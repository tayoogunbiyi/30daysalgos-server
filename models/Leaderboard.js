/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
const mongoose = require("mongoose");

const { Schema } = mongoose;

const LeaderboardSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
  const userPointMapping = await this.findOne({ user: userId });
  if (!userPointMapping) {
    const newUserPointMapping = new this();
    newUserPointMapping.user = userId;
    newUserPointMapping.points = points;
    await newUserPointMapping.save();
    return points;
  } else {
    userPointMapping.points += Math.max(0, points);
    await userPointMapping.save();
    return userPointMapping.points;
  }
};

// LeaderboardSchema.statics.sortAndSave = async function () {
//   try {
//     const leaderboard = await LeaderboardSchema.find({}).sort("points");
//     this.save(leaderboard);
//   } catch (error) {
//     return null;
//   }
// };

module.exports = mongoose.model("Leaderboard", LeaderboardSchema);
