const AppError = require('../utils/AppError');

/**
 * Factory tạo validation middleware từ Zod schema.
 * Validate req.body theo schema, trả lỗi 422 nếu không hợp lệ.
 *
 * Dùng: router.post('/login', validate(loginSchema), controller)
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field:   e.path.join('.'),
      message: e.message,
    }));
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // Gắn data đã được parse/transform vào req.body
  req.body = result.data;
  next();
};

module.exports = validate;
