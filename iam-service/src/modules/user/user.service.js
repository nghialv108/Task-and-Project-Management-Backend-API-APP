const userRepo      = require('./user.repository');
const AppError      = require('../../shared/utils/AppError');

const getMe = async (userId) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const updateProfile = async (userId, data) => {
  const user = await userRepo.updateById(userId, data);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const getUserById = async (id) => {
  const user = await userRepo.findById(id);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const getWorkspaceMembers = async (workspaceId) =>
  userRepo.findByWorkspace(workspaceId, { isActive: true });

/**
 * Chỉ Admin mới được đổi role thành viên
 */
const updateRole = async (requesterId, requesterRole, targetUserId, newRole) => {
  if (requesterRole !== 'admin') {
    throw new AppError('Forbidden: Only admin can change roles', 403);
  }
  if (String(requesterId) === String(targetUserId)) {
    throw new AppError('Cannot change your own role', 400);
  }

  const user = await userRepo.updateById(targetUserId, { role: newRole });
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const deactivateUser = async (requesterId, requesterRole, targetUserId) => {
  if (requesterRole !== 'admin') {
    throw new AppError('Forbidden: Only admin can deactivate users', 403);
  }
  if (String(requesterId) === String(targetUserId)) {
    throw new AppError('Cannot deactivate your own account', 400);
  }

  const user = await userRepo.updateById(targetUserId, { isActive: false });
  if (!user) throw new AppError('User not found', 404);
  return user;
};

module.exports = {
  getMe,
  updateProfile,
  getUserById,
  getWorkspaceMembers,
  updateRole,
  deactivateUser,
};
