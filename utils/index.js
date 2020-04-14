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
  if (!__id) throw new Error("No __id supplied", __id);
  if (!ObjectId.isValid(__id)) {
    throw new Error("Invalid Question Id");
  }
  return true;
};

const checkValidIdOnObj = async (__id, model) => {
  checkValidId(__id);
  const exists = await model.exists({ _id: __id });
  return exists;
};

module.exports = {
  removeInvalidIds,
  checkValidId,
  checkValidIdOnObj,
};
