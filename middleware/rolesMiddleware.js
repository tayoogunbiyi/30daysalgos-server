const rolesWeightMap = require('../constants/rolesWeightMap');

const { ADMIN, SUPERADMIN } = rolesWeightMap;

const NOT_PERMITTED_MSG = 'You are not permitted to perform this operation';

const isAdminOrGreater = (req, res, next) => {
  let currentUserRole = req.user.role;
  if (currentUserRole == undefined || currentUserRole == null || !(currentUserRole in rolesWeightMap)){
      currentUserRole = 'USER';
  }
  console.log(rolesWeightMap[currentUserRole] === ADMIN)
  if (ADMIN > rolesWeightMap[currentUserRole]) {
    return res.status(403).json({ message: NOT_PERMITTED_MSG });
  }
  return next();
};

const isSuperAdminOrGreater = (req, res, next) => {
  const currentUserRole = req.user.role;
  if (SUPERADMIN > rolesWeightMap[currentUserRole]) {
    return res.status(403).json({ message: NOT_PERMITTED_MSG });
  }
  return next();
};


module.exports = {
  isAdminOrGreater,
  isSuperAdminOrGreater,
};
