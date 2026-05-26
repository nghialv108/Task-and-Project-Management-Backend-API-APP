const { verifyAccessToken } = require('../utils/jwt.helper');
const AppError              = require('../utils/AppError');

/**
 * Verify JWT cho các route nội bộ của IAM.
 *
 * Token chỉ chứa { userId } — không còn role hay workspaceId.
 * Gateway inject x-user-id sau khi verify, các service khác
 * dùng header đó thay vì decode lại token.
 */
const authenticate = (req, res, next) => {
  try {
    // Gateway đã verify và inject x-user-id → dùng luôn
    if (req.headers['x-user-id']) {
      req.user = { userId: req.headers['x-user-id'] };
      return next();
    }

    // Fallback: verify trực tiếp (internal / testing)
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer '))
      throw new AppError('Unauthorized: Missing token', 401);

    const token   = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    req.user      = { userId: String(payload.userId) };
    next();
  } catch (err) {
    if (err.isOperational) return next(err);
    next(new AppError('Unauthorized: Invalid or expired token', 401));
  }
};

module.exports = { authenticate };
