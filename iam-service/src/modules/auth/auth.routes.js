const { Router }   = require('express');
const controller   = require('./auth.controller');
const validate     = require('../../shared/middlewares/validate.middleware');
const { authenticate } = require('../../shared/middlewares/auth.middleware');
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require('./auth.schema');

const router = Router();

// ─── Public ───────────────────────────────────────────────────────────────────
router.post('/register',       validate(registerSchema),       controller.register);
router.post('/login',          validate(loginSchema),          controller.login);
router.post('/refresh-token',  validate(refreshTokenSchema),   controller.refreshToken);
router.post('/forgot-password',validate(forgotPasswordSchema), controller.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema),  controller.resetPassword);

// ─── Protected ────────────────────────────────────────────────────────────────
router.post('/logout',          authenticate, controller.logout);
router.put('/change-password',  authenticate, validate(changePasswordSchema), controller.changePassword);

module.exports = router;
