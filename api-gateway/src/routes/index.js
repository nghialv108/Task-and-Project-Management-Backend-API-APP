const { Router } = require('express');
const iamRoutes = require('./iam.routes');
const coreRoutes = require('./core.routes');
const bffRoutes = require('./bff.routes');

const router = Router();

/**
 * Route map:
 *
 *   /api/iam/**   → iam-service   (rewrite: /api/iam  → /iam)
 *   /api/core/**  → core-service  (rewrite: /api/core → /core)
 *   /api/bff/**   → bff-service   (rewrite: /api/bff  → /bff)
 */
router.use('/iam', iamRoutes);
router.use('/core', coreRoutes);
router.use('/bff', bffRoutes);

module.exports = router;