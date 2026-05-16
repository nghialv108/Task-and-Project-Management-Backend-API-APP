const jwt = require('jsonwebtoken');
const env  = require('../config/environment');

/**
 * Ký Access Token (ngắn hạn)
 * Payload chứa thông tin cần thiết cho downstream services
 */
const signAccessToken = (payload) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

/**
 * Ký Refresh Token (dài hạn)
 * Chỉ chứa userId để giảm thiểu rủi ro nếu bị lộ
 */
const signRefreshToken = (userId) =>
  jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });

/**
 * Verify Access Token
 * @throws JsonWebTokenError | TokenExpiredError
 */
const verifyAccessToken = (token) =>
  jwt.verify(token, env.JWT_SECRET);

/**
 * Verify Refresh Token
 * @throws JsonWebTokenError | TokenExpiredError
 */
const verifyRefreshToken = (token) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET);

/**
 * Tạo cặp token hoàn chỉnh từ user document
 */
const generateTokenPair = (user) => {
  const payload = {
    userId:      user._id,
    email:       user.email,
    role:        user.role,
    workspaceId: user.workspaceId ?? null,
  };

  return {
    accessToken:  signAccessToken(payload),
    refreshToken: signRefreshToken(user._id),
  };
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokenPair,
};
