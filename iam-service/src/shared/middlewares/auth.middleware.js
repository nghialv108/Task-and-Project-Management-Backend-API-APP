const { verifyAccessToken } = require('../utils/jwt.helper');
const AppError              = require('../utils/AppError');

/**
 * Verify JWT cho các route nội bộ của IAM cần bảo vệ.
 * (VD: GET /iam/users/me, PUT /iam/users/profile)
 *
 * Gateway đã verify trước, nhưng IAM verify lại để
 * defense-in-depth khi có request internal trực tiếp.
 */
const authenticate = (req, res, next) => {
  try {
    // Ưu tiên lấy từ header x-user-id do gateway inject
    // nếu có → đã được gateway verify rồi, dùng luôn
    if (req.headers['x-user-id']) {
      req.user = {
        userId:      req.headers['x-user-id'],
        role:        req.headers['x-user-role']    || '',
        workspaceId: req.headers['x-workspace-id'] || null,
      };
      return next();
    }

    // Fallback: verify JWT trực tiếp (internal / testing)
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('Unauthorized: Missing token', 401);
    }

    const token   = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    req.user      = payload;
    next();
  } catch (err) {
    if (err.isOperational) return next(err);
    next(new AppError('Unauthorized: Invalid or expired token', 401));
  }
};

/**
 * Kiểm tra role. Dùng sau authenticate.
 * VD: authorize('admin', 'manager')
 */
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return next(new AppError('Forbidden: Insufficient permissions', 403));
  }
  next();
};

module.exports = { authenticate, authorize };
