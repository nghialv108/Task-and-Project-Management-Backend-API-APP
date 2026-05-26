const userRepo = require('./user.repository');
const AppError = require('../../shared/utils/AppError');

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

// ─── Deactivate ───────────────────────────────────────────────────────────────

const deactivateUser = async (requesterId, targetUserId) => {
  // Không thể tự deactivate chính mình
  if (String(requesterId) === String(targetUserId))
    throw new AppError('Cannot deactivate your own account', 400);

  const target = await userRepo.findById(targetUserId);
  if (!target) throw new AppError('User not found', 404);

  if (!target.isActive)
    throw new AppError('User account is already deactivated', 409);

  const updated = await userRepo.updateById(targetUserId, { isActive: false });
  return updated;
};

module.exports = {
  getMe,
  updateProfile,
  getUserById,
  deactivateUser,
};