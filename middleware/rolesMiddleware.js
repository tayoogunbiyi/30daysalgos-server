const rolesWeightMap = require('../constants/rolesWeightMap');

const { ADMIN, SUPERADMIN } = rolesWeightMap;

const NOT_PERMITTED_MSG = 'You are not permitted to perform this operation';

const cleanUserRole = (role) => {
    if (role == undefined || role == null || !(role in rolesWeightMap)){
        return 'USER';
    }
    return role;
}

const isAdminOrGreater = (req, res, next) => {
  const currentUserRole = cleanUserRole(req.user.role);

  if (ADMIN > rolesWeightMap[currentUserRole]) {
    return res.status(403).json({ message: NOT_PERMITTED_MSG });
  }
  return next();
};

const isSuperAdminOrGreater = (req, res, next) => {
  const currentUserRole = cleanUserRole(req.user.role);
  if (SUPERADMIN > rolesWeightMap[currentUserRole]) {
    return res.status(403).json({ message: NOT_PERMITTED_MSG });
  }
  return next();
};


module.exports = {
  isAdminOrGreater,
  isSuperAdminOrGreater,
};
