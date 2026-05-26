const { Router } = require('express');
const controller = require('./workspace.controller');
const { authenticate } = require('../../shared/middlewares/auth.middleware');
const { gatewayOnly } = require('../../shared/middlewares/internal.middleware');
const validate = require('../../shared/middlewares/validate.middleware');
const {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  addMemberSchema,
  updateMemberRoleSchema,
} = require('./workspace.schema');

const router = Router();

// ─── Internal routes — không qua user authenticate ────────────────────────────
// Bảo vệ bằng x-internal-secret (gatewayOnly middleware)
router.get('/internal/member-context', gatewayOnly, controller.getMemberContext);
router.post('/internal/invalidate-cache', gatewayOnly, controller.invalidateMemberCache);

// ─── User routes ──────────────────────────────────────────────────────────────
router.use(authenticate);

router.post('/', validate(createWorkspaceSchema), controller.createWorkspace);
router.get('/mine', controller.getMyWorkspaces);
router.get('/:id', controller.getWorkspaceById);
router.put('/:id', validate(updateWorkspaceSchema), controller.updateWorkspace);

// ─── Member management ────────────────────────────────────────────────────────
router.get('/:id/members', controller.getMembers);
router.post('/:id/members', validate(addMemberSchema), controller.addMember);
router.delete('/:id/members/:memberId', controller.removeMember);
router.patch('/:id/members/:memberId/role', validate(updateMemberRoleSchema), controller.updateMemberRole);

module.exports = router;
