const jwt = require('jsonwebtoken');
const env = require('../config/environment');

/**
 * Danh sách path không cần xác thực.
 * Chỉ bao gồm auth endpoints của IAM service.
 */
const PUBLIC_PATHS = [
  '/health',
  '/api/iam/auth/register',
  '/api/iam/auth/login',
  '/api/iam/auth/refresh-token',
  '/api/iam/auth/forgot-password',
  '/api/iam/auth/reset-password',
];

/**
 * Kiểm tra path có thuộc public không.
 * Dùng startsWith để cover cả sub-path nếu cần.
 */
const isPublicPath = (path) =>
  PUBLIC_PATHS.some((pub) => path.startsWith(pub));

/**
 * Auth Middleware
 * - Bỏ qua PUBLIC_PATHS
 * - Verify JWT, gắn payload vào req.user
 * - Forward header x-user-id, x-user-role cho downstream services
 */
const authMiddleware = (req, res, next) => {
  if (isPublicPath(req.path)) return next();

  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Missing or invalid Authorization header',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);

    // Gắn thông tin user vào request
    req.user = payload;

    // Forward thông tin user cho downstream services qua header
    req.headers['x-user-id'] = String(payload.userId || payload.id || '');
    req.headers['x-user-role'] = String(payload.role || '');
    req.headers['x-workspace-id'] = String(payload.workspaceId || '');
    req.headers['x-internal-secret'] = env.INTERNAL_SECRET;

    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Token has expired',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid token',
    });
  }
};

module.exports = authMiddleware;
