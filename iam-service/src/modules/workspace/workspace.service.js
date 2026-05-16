const workspaceRepo = require('./workspace.repository');
const userRepo      = require('../user/user.repository');
const AppError      = require('../../shared/utils/AppError');

const createWorkspace = async (ownerId, data) => {
  const existing = await workspaceRepo.findBySlug(data.slug);
  if (existing) throw new AppError('Workspace slug already taken', 409);

  const workspace = await workspaceRepo.create({ ...data, ownerId });

  // Gán workspace cho owner và set role admin
  await userRepo.updateById(ownerId, {
    workspaceId: workspace._id,
    role: 'admin',
  });

  return workspace;
};

const getWorkspaceById = async (id) => {
  const workspace = await workspaceRepo.findById(id);
  if (!workspace) throw new AppError('Workspace not found', 404);
  return workspace;
};

const getMyWorkspace = async (userId) => {
  const user = await userRepo.findById(userId);
  if (!user?.workspaceId) throw new AppError('You are not in any workspace', 404);
  return workspaceRepo.findById(user.workspaceId);
};

const updateWorkspace = async (userId, userRole, workspaceId, data) => {
  const workspace = await workspaceRepo.findById(workspaceId);
  if (!workspace) throw new AppError('Workspace not found', 404);

  const isOwner = String(workspace.ownerId) === String(userId);
  if (!isOwner && userRole !== 'admin') {
    throw new AppError('Forbidden: Only owner or admin can update workspace', 403);
  }

  return workspaceRepo.updateById(workspaceId, data);
};

const addMember = async (requesterId, requesterRole, workspaceId, memberId) => {
  if (requesterRole !== 'admin') {
    throw new AppError('Forbidden: Only admin can add members', 403);
  }

  const [workspace, member] = await Promise.all([
    workspaceRepo.findById(workspaceId),
    userRepo.findById(memberId),
  ]);

  if (!workspace) throw new AppError('Workspace not found', 404);
  if (!member)    throw new AppError('User not found', 404);
  if (String(member.workspaceId) === String(workspaceId)) {
    throw new AppError('User is already in this workspace', 409);
  }

  await userRepo.updateById(memberId, { workspaceId, role: 'member' });
  return userRepo.findById(memberId);
};

const removeMember = async (requesterId, requesterRole, workspaceId, memberId) => {
  if (requesterRole !== 'admin') {
    throw new AppError('Forbidden: Only admin can remove members', 403);
  }
  if (String(requesterId) === String(memberId)) {
    throw new AppError('Cannot remove yourself from workspace', 400);
  }

  const member = await userRepo.findById(memberId);
  if (!member) throw new AppError('User not found', 404);
  if (String(member.workspaceId) !== String(workspaceId)) {
    throw new AppError('User is not in this workspace', 400);
  }

  await userRepo.updateById(memberId, { workspaceId: null, role: 'member' });
};

module.exports = {
  createWorkspace,
  getWorkspaceById,
  getMyWorkspace,
  updateWorkspace,
  addMember,
  removeMember,
};
