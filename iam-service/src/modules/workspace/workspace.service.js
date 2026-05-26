const workspaceRepo      = require('./workspace.repository');
const memberRepo         = require('./workspace.member.repository');
const userRepo           = require('../user/user.repository');
const AppError           = require('../../shared/utils/AppError');
const { invalidateMemberCache } = require('../../shared/utils/cacheInvalidator');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const assertWorkspaceExists = async (id) => {
  const ws = await workspaceRepo.findById(id);
  if (!ws) throw new AppError('Workspace not found', 404);
  return ws;
};

const assertMemberRole = async (userId, workspaceId, ...allowedRoles) => {
  const member = await memberRepo.findMember(userId, workspaceId);
  if (!member) throw new AppError('You are not a member of this workspace', 403);
  if (!allowedRoles.includes(member.role))
    throw new AppError('Forbidden: Insufficient workspace role', 403);
  return member;
};

// ─── Workspace CRUD ───────────────────────────────────────────────────────────

const createWorkspace = async (ownerId, data) => {
  const existing = await workspaceRepo.findBySlug(data.slug);
  if (existing) throw new AppError('Workspace slug already taken', 409);

  const workspace = await workspaceRepo.create({ ...data, ownerId });

  await memberRepo.createMember(ownerId, workspace._id, 'admin');

  return workspace;
};

const getWorkspaceById = async (requesterId, workspaceId) => {
  const [workspace] = await Promise.all([
    assertWorkspaceExists(workspaceId),
    assertMemberRole(requesterId, workspaceId, 'admin', 'manager', 'member'),
  ]);
  return workspace;
};

// Multi-workspace: trả về tất cả workspace user đang tham gia kèm role
const getMyWorkspaces = async (userId) => {
  const memberships = await memberRepo.findUserWorkspaces(userId);
  return memberships.map((m) => ({
    ...m.workspaceId.toJSON(),
    role:     m.role,
    joinedAt: m.joinedAt,
  }));
};

const updateWorkspace = async (requesterId, workspaceId, data) => {
  const workspace = await assertWorkspaceExists(workspaceId);
  const member    = await memberRepo.findMember(requesterId, workspaceId);

  const isOwner = String(workspace.ownerId) === String(requesterId);
  if (!isOwner && member?.role !== 'admin')
    throw new AppError('Forbidden: Only owner or admin can update workspace', 403);

  return workspaceRepo.updateById(workspaceId, data);
};

// ─── Member management ────────────────────────────────────────────────────────

const getMembers = async (requesterId, workspaceId) => {
  await assertMemberRole(requesterId, workspaceId, 'admin', 'manager', 'member');
  return memberRepo.findMembers(workspaceId);
};

const addMember = async (requesterId, workspaceId, targetUserId, role = 'member') => {
  await assertMemberRole(requesterId, workspaceId, 'admin');
  await assertWorkspaceExists(workspaceId);

  const targetUser = await userRepo.findById(targetUserId);
  if (!targetUser) throw new AppError('User not found', 404);
  if (!targetUser.isActive) throw new AppError('User account is deactivated', 400);

  const existing = await memberRepo.findMemberAny(targetUserId, workspaceId);
  if (existing) {
    if (existing.isActive)
      throw new AppError('User is already a member of this workspace', 409);
    const reactivated = await memberRepo.reactivateMember(targetUserId, workspaceId, role);
    invalidateMemberCache(String(targetUserId), String(workspaceId));
    return reactivated;
  }

  const member = await memberRepo.createMember(targetUserId, workspaceId, role);
  invalidateMemberCache(String(targetUserId), String(workspaceId));
  return member;
};

const removeMember = async (requesterId, workspaceId, targetUserId) => {
  await assertMemberRole(requesterId, workspaceId, 'admin');

  if (String(requesterId) === String(targetUserId))
    throw new AppError('Cannot remove yourself from workspace', 400);

  const workspace = await assertWorkspaceExists(workspaceId);
  if (String(workspace.ownerId) === String(targetUserId))
    throw new AppError('Cannot remove the workspace owner', 400);

  const member = await memberRepo.findMember(targetUserId, workspaceId);
  if (!member) throw new AppError('User is not a member of this workspace', 404);

  await memberRepo.deactivateMember(targetUserId, workspaceId);
  invalidateMemberCache(String(targetUserId), String(workspaceId));
};

const updateMemberRole = async (requesterId, workspaceId, targetUserId, newRole) => {
  await assertMemberRole(requesterId, workspaceId, 'admin');

  if (String(requesterId) === String(targetUserId))
    throw new AppError('Cannot change your own role', 400);

  const workspace = await assertWorkspaceExists(workspaceId);
  if (String(workspace.ownerId) === String(targetUserId))
    throw new AppError('Cannot change the role of workspace owner', 400);

  const member = await memberRepo.findMember(targetUserId, workspaceId);
  if (!member) throw new AppError('User is not a member of this workspace', 404);

  const updated = await memberRepo.updateMemberRole(targetUserId, workspaceId, newRole);
  invalidateMemberCache(String(targetUserId), String(workspaceId));
  return updated;
};

// ─── Internal — dùng bởi gateway để populate cache ────────────────────────────
const getMemberContext = async (userId, workspaceId) => {
  const member = await memberRepo.findMember(userId, workspaceId);
  if (!member) return null;
  return {
    workspaceId: member.workspaceId,
    role:        member.role,
    joinedAt:    member.joinedAt,
  };
};

module.exports = {
  createWorkspace,
  getWorkspaceById,
  getMyWorkspaces,
  updateWorkspace,
  getMembers,
  addMember,
  removeMember,
  updateMemberRole,
  getMemberContext,
};
