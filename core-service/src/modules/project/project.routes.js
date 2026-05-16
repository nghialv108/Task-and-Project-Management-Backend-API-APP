const { Router } = require('express');
const ctrl       = require('./project.controller');
const validate   = require('../../shared/middlewares/validate.middleware');
const { createProjectSchema, updateProjectSchema, milestoneSchema, memberSchema } = require('./project.schema');

const router = Router();

router.get('/',                         ctrl.getProjects);
router.post('/',     validate(createProjectSchema), ctrl.createProject);
router.get('/:id',                      ctrl.getProjectById);
router.put('/:id',   validate(updateProjectSchema), ctrl.updateProject);
router.delete('/:id',                   ctrl.deleteProject);

// Members
router.post('/:id/members',   validate(memberSchema), ctrl.addMember);
router.delete('/:id/members/:memberId', ctrl.removeMember);

// Milestones
router.post('/:id/milestones', validate(milestoneSchema), ctrl.addMilestone);
router.put('/:id/milestones/:mid', validate(milestoneSchema), ctrl.updateMilestone);

module.exports = router;
