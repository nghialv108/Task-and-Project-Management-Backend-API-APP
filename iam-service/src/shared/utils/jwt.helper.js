const jwt = require('jsonwebtoken');
const env = require('../config/environment');

/**
 * Access Token — chứa userId + email (từ V2).
 * workspaceId và role KHÔNG nằm trong token.
 * Gateway resolve context qua Redis hoặc IAM mỗi request.
 */
const signAccessToken = (payload) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

/**
 * Refresh Token — chỉ chứa userId để giảm rủi ro nếu bị lộ.
 */
const signRefreshToken = (userId) =>
  jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });

const verifyAccessToken  = (token) => jwt.verify(token, env.JWT_SECRET);
const verifyRefreshToken = (token) => jwt.verify(token, env.JWT_REFRESH_SECRET);

/**
 * Tạo cặp token từ user object.
 * accessToken chứa userId + email; refreshToken chỉ chứa userId.
 */
const generateTokenPair = (user) => {
  const payload = {
    userId: user._id,
    email:  user.email,
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
