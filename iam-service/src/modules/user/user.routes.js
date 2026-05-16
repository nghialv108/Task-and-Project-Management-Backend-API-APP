const { Router }       = require('express');
const controller       = require('./user.controller');
const validate         = require('../../shared/middlewares/validate.middleware');
const { authenticate, authorize } = require('../../shared/middlewares/auth.middleware');
const { updateProfileSchema, updateRoleSchema } = require('./user.schema');

const router = Router();

// Tất cả user routes đều yêu cầu auth
router.use(authenticate);

// ─── Profile ──────────────────────────────────────────────────────────────────
router.get('/me',         controller.getMe);
router.put('/me',         validate(updateProfileSchema), controller.updateProfile);

// ─── Workspace members ────────────────────────────────────────────────────────
router.get('/workspace/:workspaceId/members', controller.getWorkspaceMembers);

// ─── Admin operations ─────────────────────────────────────────────────────────
router.get('/:id',                controller.getUserById);
router.patch('/:id/role',         authorize('admin'), validate(updateRoleSchema), controller.updateRole);
router.patch('/:id/deactivate',   authorize('admin'), controller.deactivateUser);

module.exports = router;
