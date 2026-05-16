const projectRepo = require('./project.repository');
const AppError    = require('../../shared/utils/AppError');
const eventBus    = require('../../shared/events/eventBus');
const EVENTS      = require('../../shared/events/eventNames');
const { ROLE }    = require('../../shared/interfaces/enums');

const canManage = (role) => [ROLE.ADMIN, ROLE.MANAGER].includes(role);

// ── Helpers ───────────────────────────────────────────────────────────────────
const assertProjectAccess = async (projectId, userId, workspaceId) => {
  const project = await projectRepo.findById(projectId);
  if (!project) throw new AppError('Project not found', 404);
  if (String(project.workspaceId) !== String(workspaceId))
    throw new AppError('Project not found', 404);
  const isMember = project.members.some((m) => String(m) === String(userId));
  if (!isMember) throw new AppError('Forbidden: You are not a member of this project', 403);
  return project;
};

// ── CRUD ──────────────────────────────────────────────────────────────────────
const createProject = async ({ userId, role, workspaceId }, body) => {
  if (!canManage(role)) throw new AppError('Forbidden: Only admin/manager can create projects', 403);

  const project = await projectRepo.create({
    ...body,
    workspaceId,
    ownerId: userId,
    members: [userId],
  });

  eventBus.emit(EVENTS.PROJECT_CREATED, {
    projectId:   project._id,
    name:        project.name,
    workspaceId,
    createdBy:   userId,
  });

  return project;
};

const getProjects = async ({ workspaceId }) =>
  projectRepo.findByWorkspace(workspaceId);

const getProjectById = async ({ userId, workspaceId }, projectId) =>
  assertProjectAccess(projectId, userId, workspaceId);

const updateProject = async ({ userId, role, workspaceId }, projectId, body) => {
  const project = await assertProjectAccess(projectId, userId, workspaceId);

  const isOwner = String(project.ownerId) === String(userId);
  if (!isOwner && !canManage(role))
    throw new AppError('Forbidden: Only owner or admin/manager can update this project', 403);

  const updated = await projectRepo.updateById(projectId, body);

  eventBus.emit(EVENTS.PROJECT_UPDATED, {
    projectId, updatedBy: userId, changes: body,
  });

  return updated;
};

const deleteProject = async ({ userId, role, workspaceId }, projectId) => {
  const project = await assertProjectAccess(projectId, userId, workspaceId);

  const isOwner = String(project.ownerId) === String(userId);
  if (!isOwner && role !== ROLE.ADMIN)
    throw new AppError('Forbidden: Only owner or admin can delete this project', 403);

  await projectRepo.deleteById(projectId);

  eventBus.emit(EVENTS.PROJECT_DELETED, { projectId, deletedBy: userId, workspaceId });
};

// ── Members ───────────────────────────────────────────────────────────────────
const addMember = async ({ userId, role, workspaceId }, projectId, memberId) => {
  await assertProjectAccess(projectId, userId, workspaceId);
  if (!canManage(role)) throw new AppError('Forbidden: Only admin/manager can add members', 403);

  const updated = await projectRepo.addMember(projectId, memberId);

  eventBus.emit(EVENTS.PROJECT_MEMBER_ADDED, {
    projectId, memberId, addedBy: userId,
  });

  return updated;
};

const removeMember = async ({ userId, role, workspaceId }, projectId, memberId) => {
  await assertProjectAccess(projectId, userId, workspaceId);
  if (!canManage(role)) throw new AppError('Forbidden: Only admin/manager can remove members', 403);
  if (String(userId) === String(memberId))
    throw new AppError('Cannot remove yourself from project', 400);

  const updated = await projectRepo.removeMember(projectId, memberId);

  eventBus.emit(EVENTS.PROJECT_MEMBER_REMOVED, { projectId, memberId, removedBy: userId });

  return updated;
};

// ── Milestones ────────────────────────────────────────────────────────────────
const addMilestone = async ({ userId, role, workspaceId }, projectId, data) => {
  await assertProjectAccess(projectId, userId, workspaceId);
  if (!canManage(role)) throw new AppError('Forbidden: Only admin/manager can add milestones', 403);
  return projectRepo.addMilestone(projectId, data);
};

const updateMilestone = async ({ userId, role, workspaceId }, projectId, milestoneId, data) => {
  await assertProjectAccess(projectId, userId, workspaceId);
  if (!canManage(role)) throw new AppError('Forbidden', 403);
  return projectRepo.updateMilestone(projectId, milestoneId, data);
};

module.exports = {
  createProject, getProjects, getProjectById,
  updateProject, deleteProject,
  addMember, removeMember,
  addMilestone, updateMilestone,
};
