const crypto = require('crypto');
const userRepo = require('../user/user.repository');
const { hash, compare } = require('../../shared/utils/hash');
const { generateTokenPair,
  verifyRefreshToken } = require('../../shared/utils/jwt.helper');
const { sendResetPasswordEmail } = require('../../shared/utils/mailer');
const AppError = require('../../shared/utils/AppError');
const env = require('../../shared/config/environment');

// ─── Register ─────────────────────────────────────────────────────────────────
const register = async ({ fullName, email, password }) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new AppError('Email already in use', 409);

  const hashedPassword = await hash(password);
  const user = await userRepo.create({ fullName, email, password: hashedPassword });

  const tokens = generateTokenPair(user);

  // Lưu hash của refresh token để validate sau
  const rtHash = await hash(tokens.refreshToken);
  await userRepo.updateById(user._id, { refreshTokenHash: rtHash });

  return { user, ...tokens };
};

// ─── Login ────────────────────────────────────────────────────────────────────
const login = async ({ email, password }) => {

  const user = await userRepo.findByEmailWithPassword(email);
  if (!user) throw new AppError('Invalid email or password', 401);
  if (!user.isActive) throw new AppError('Account has been deactivated', 403);

  const isMatch = await compare(password, user.password);
  if (!isMatch) throw new AppError('Invalid email or password', 401);

  const tokens = generateTokenPair(user);

  // Cập nhật refresh token hash + lastLoginAt
  const rtHash = await hash(tokens.refreshToken);
  await userRepo.updateById(user._id, {
    refreshTokenHash: rtHash,
    lastLoginAt: new Date(),
  });

  // Lấy lại user sạch (không có password)
  const cleanUser = await userRepo.findById(user._id);
  return { user: cleanUser, ...tokens };
};

// ─── Refresh Token ────────────────────────────────────────────────────────────
const refreshToken = async (token) => {
  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const user = await userRepo.findByIdWithPassword(payload.userId);
  if (!user || !user.refreshTokenHash) {
    throw new AppError('Invalid refresh token', 401);
  }

  const isValid = await compare(token, user.refreshTokenHash);
  if (!isValid) throw new AppError('Invalid refresh token', 401);

  const tokens = generateTokenPair(user);
  const rtHash = await hash(tokens.refreshToken);
  await userRepo.updateById(user._id, { refreshTokenHash: rtHash });

  return tokens;
};

// ─── Logout ───────────────────────────────────────────────────────────────────
const logout = async (userId) => {
  // Xóa refresh token hash → token cũ không dùng được nữa
  await userRepo.updateById(userId, { refreshTokenHash: null });
};

// ─── Forgot Password ──────────────────────────────────────────────────────────
const forgotPassword = async (email) => {
  const user = await userRepo.findByEmail(email);

  // Không tiết lộ email có tồn tại hay không (security best practice)
  if (!user) return;

  const resetToken = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

  await userRepo.updateById(user._id, {
    resetPasswordToken: resetToken,
    resetPasswordExpires: expires,
  });

  const resetLink = `${env.CLIENT_URL}/reset-password?token=${resetToken}`;
  await sendResetPasswordEmail(user.email, resetLink);
};

// ─── Reset Password ───────────────────────────────────────────────────────────
const resetPassword = async ({ token, password }) => {
  const user = await userRepo.findByResetToken(token);
  if (!user) throw new AppError('Invalid or expired reset token', 400);

  const hashedPassword = await hash(password);
  await userRepo.updateById(user._id, {
    password: hashedPassword,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    refreshTokenHash: null, // Force logout tất cả thiết bị
  });
};

// ─── Change Password ──────────────────────────────────────────────────────────
const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await userRepo.findByIdWithPassword(userId);
  if (!user) throw new AppError('User not found', 404);

  const isMatch = await compare(currentPassword, user.password);
  if (!isMatch) throw new AppError('Current password is incorrect', 400);

  const hashedPassword = await hash(newPassword);
  await userRepo.updateById(userId, {
    password: hashedPassword,
    refreshTokenHash: null, // Force logout tất cả thiết bị
  });
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
};
