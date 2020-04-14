const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const removeInvalidIds = (arr) => {
  const validIds = [];
  arr.forEach((id) => {
    if (ObjectId.isValid(id)) {
      validIds.push(id);
    }
  });
  return validIds;
};

const checkValidId = (__id) => {
  if (!ObjectId.isValid(__id)) {
    throw new Error("Invalid Question Id");
  }
  return true;
};

module.exports = {
  removeInvalidIds,
  checkValidId,
};
