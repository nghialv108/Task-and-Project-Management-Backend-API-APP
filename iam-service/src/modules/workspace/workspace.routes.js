const { Router }       = require('express');
const controller       = require('./workspace.controller');
const validate         = require('../../shared/middlewares/validate.middleware');
const { authenticate } = require('../../shared/middlewares/auth.middleware');
const { createWorkspaceSchema, updateWorkspaceSchema } = require('../user/user.schema');
const { z }            = require('zod');

const router = Router();

router.use(authenticate);

// ─── Workspace CRUD ───────────────────────────────────────────────────────────
router.post('/',          validate(createWorkspaceSchema), controller.createWorkspace);
router.get('/mine',       controller.getMyWorkspace);
router.get('/:id',        controller.getWorkspaceById);
router.put('/:id',        validate(updateWorkspaceSchema), controller.updateWorkspace);

// ─── Member management ────────────────────────────────────────────────────────
router.post('/:id/members',
  validate(z.object({ userId: z.string().min(1, 'userId is required') })),
  controller.addMember,
);
router.delete('/:id/members/:memberId', controller.removeMember);

module.exports = router;
