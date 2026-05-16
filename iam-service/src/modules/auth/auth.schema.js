const { z } = require('zod');

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email:    z.string().email('Invalid email address').toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/,  'Password must contain at least 1 uppercase letter')
    .regex(/[0-9]/,  'Password must contain at least 1 number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least 1 special character'),
});

const loginSchema = z.object({
  email:    z.string().email('Invalid email').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email').toLowerCase(),
});

const resetPasswordSchema = z.object({
  token:    z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/,  'Password must contain at least 1 uppercase letter')
    .regex(/[0-9]/,  'Password must contain at least 1 number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least 1 special character'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[0-9]/)
    .regex(/[^a-zA-Z0-9]/),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
};
