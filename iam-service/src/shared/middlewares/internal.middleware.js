const env      = require('../config/environment');
const AppError = require('../utils/AppError');

/**
 * Chỉ cho phép request từ gateway (có x-internal-secret đúng).
 * Mount trước các internal endpoint không cần user auth.
 */
const gatewayOnly = (req, res, next) => {
  const secret = req.headers['x-internal-secret'];
  if (!secret || secret !== env.INTERNAL_SECRET)
    return next(new AppError('Forbidden: Internal access only', 403));
  next();
};

module.exports = { gatewayOnly };
