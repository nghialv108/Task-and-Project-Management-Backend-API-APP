const userService = require('./user.service');
const response    = require('../../shared/utils/response');

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

const getWorkspaceMembers = async (req, res, next) => {
  try {
    const members = await userService.getWorkspaceMembers(req.params.workspaceId);
    return response.ok(res, members);
  } catch (err) { next(err); }
};

const updateRole = async (req, res, next) => {
  try {
    const user = await userService.updateRole(
      req.user.userId,
      req.user.role,
      req.params.id,
      req.body.role,
    );
    return response.ok(res, user, 'Role updated');
  } catch (err) { next(err); }
};

const deactivateUser = async (req, res, next) => {
  try {
    await userService.deactivateUser(req.user.userId, req.user.role, req.params.id);
    return response.ok(res, null, 'User deactivated');
  } catch (err) { next(err); }
};

module.exports = {
  getMe,
  updateProfile,
  getUserById,
  getWorkspaceMembers,
  updateRole,
  deactivateUser,
};
