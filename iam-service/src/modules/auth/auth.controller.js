const authService = require('./auth.service');
const response = require('../../shared/utils/response');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return response.created(res, result, 'Registration successful');
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return response.ok(res, result, 'Login successful');
  } catch (err) { next(err); }
};

const refreshToken = async (req, res, next) => {
  try {
    const tokens = await authService.refreshToken(req.body.refreshToken);
    return response.ok(res, tokens, 'Token refreshed');
  } catch (err) { next(err); }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.userId);
    return response.ok(res, null, 'Logged out successfully');
  } catch (err) { next(err); }
};

const forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email);
    // Luôn trả 200 dù email có tồn tại hay không (tránh user enumeration)
    return response.ok(res, null, 'If that email exists, a reset link has been sent');
  } catch (err) { next(err); }
};

const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.body);
    return response.ok(res, null, 'Password reset successfully');
  } catch (err) { next(err); }
};

const changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(req.user.userId, req.body);
    return response.ok(res, null, 'Password changed successfully');
  } catch (err) { next(err); }
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
