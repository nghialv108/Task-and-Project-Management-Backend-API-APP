const { Router } = require('express');
const { createServiceProxy } = require('../proxy/proxy.handler');
const { getService } = require('../proxy/serviceRegistry');
const { breakers } = require('../proxy/circuitBreaker');
const { authLimiter } = require('../middlewares/rateLimit.middleware');

const router = Router();
const { url } = getService('iam');
const proxy = createServiceProxy(url);

/**
 * /api/iam/auth/*  — Public, rate limit ketat (brute force protection)
 * /api/iam/**      — Protected (auth middleware đã mount global ở app.js)
 *
 * Tất cả request forward nguyên vẹn đến iam-service.
 * pathRewrite: /api/iam/auth/login → /iam/auth/login
 */

router.use('/auth', authLimiter, breakers.iam.middleware(), createServiceProxy(url, '/iam/auth'));
router.use('/users', breakers.iam.middleware(), createServiceProxy(url, '/iam/users'));
router.use('/workspaces', breakers.iam.middleware(), createServiceProxy(url, '/iam/workspaces'));
module.exports = router;
