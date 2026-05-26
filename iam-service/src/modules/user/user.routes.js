const { Router } = require('express');
const controller = require('./user.controller');
const validate = require('../../shared/middlewares/validate.middleware');
const { authenticate } = require('../../shared/middlewares/auth.middleware');
const { adminOnly } = require('../../shared/middlewares/adminOnly.middleware');
const { updateProfileSchema } = require('./user.schema');

const router = Router();

router.use(authenticate);

// ─── Profile ──────────────────────────────────────────────────────────────────
router.get('/me', controller.getMe);
router.put('/me', validate(updateProfileSchema), controller.updateProfile);
router.get('/:id', controller.getUserById);

// ─── Admin only ───────────────────────────────────────────────────────────────
router.patch('/:id/deactivate', adminOnly, controller.deactivateUser);

module.exports = router;