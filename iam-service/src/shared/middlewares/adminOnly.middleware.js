const AppError = require('../utils/AppError');

/**
 * Middleware: chỉ cho phép system admin (x-user-role: admin được inject bởi gateway).
 *
 * Gateway sau khi verify JWT và load member context sẽ inject:
 *   x-user-id      → userId
 *   x-workspace-id → workspaceId (nếu có)
 *   x-role         → role của user trong workspace hiện tại
 *
 * Deactivate là hành động system-level: chỉ workspace admin mới được gọi.
 * Route này yêu cầu x-workspace-id header để gateway biết context nào cần check.
 */
const adminOnly = (req, res, next) => {
    const role = req.headers['x-role'];
    if (!role)
        return next(new AppError('Forbidden: No role context found', 403));
    if (role !== 'admin')
        return next(new AppError('Forbidden: Admin role required', 403));
    next();
};

module.exports = { adminOnly };