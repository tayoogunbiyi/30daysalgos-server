const mongoose = require('mongoose');
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


module.exports = {
    removeInvalidIds,
}