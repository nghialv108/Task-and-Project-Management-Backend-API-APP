const userService = require('./user.service');
const response = require('../../shared/utils/response');

const getMe = async (req, res, next) => {
  try {
    const user = await userService.getMe(req.user.userId);
    return response.ok(res, user);
  } catch (err) { next(err); }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user.userId, req.body);
    return response.ok(res, user, 'Profile updated');
  } catch (err) { next(err); }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return response.ok(res, user);
  } catch (err) { next(err); }
};

// ─── Deactivate ───────────────────────────────────────────────────────────────

const deactivateUser = async (req, res, next) => {
  try {
    await userService.deactivateUser(req.user.userId, req.params.id);
    return response.ok(res, null, 'User account has been deactivated');
  } catch (err) { next(err); }
};

module.exports = {
  getMe,
  updateProfile,
  getUserById,
  deactivateUser,
};