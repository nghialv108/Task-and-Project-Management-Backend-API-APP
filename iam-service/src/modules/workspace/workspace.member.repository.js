const { WorkspaceMember } = require('./workspace.member.model');

// ─── Read ─────────────────────────────────────────────────────────────────────

// Chỉ lấy active member
const findMember = (userId, workspaceId) =>
  WorkspaceMember.findOne({ userId, workspaceId, isActive: true });

// Lấy kể cả inactive (để reactivate)
const findMemberAny = (userId, workspaceId) =>
  WorkspaceMember.findOne({ userId, workspaceId });

// Tất cả workspace của 1 user (multi-workspace support)
const findUserWorkspaces = (userId) =>
  WorkspaceMember
    .find({ userId, isActive: true })
    .populate('workspaceId');

// Tất cả member của 1 workspace
const findMembers = (workspaceId) =>
  WorkspaceMember
    .find({ workspaceId, isActive: true })
    .populate('userId', 'fullName email avatarUrl isActive lastLoginAt');

const isMember = async (userId, workspaceId) => {
  const m = await WorkspaceMember.findOne({ userId, workspaceId, isActive: true });
  return !!m;
};

// ─── Write ────────────────────────────────────────────────────────────────────

const createMember = (userId, workspaceId, role = 'member') =>
  WorkspaceMember.create({ userId, workspaceId, role });

// Reactivate member đã bị remove trước đó (multi-workspace: có thể rejoin)
const reactivateMember = (userId, workspaceId, role) =>
  WorkspaceMember.findOneAndUpdate(
    { userId, workspaceId },
    { isActive: true, role, joinedAt: new Date() },
    { new: true }
  );

const updateMemberRole = (userId, workspaceId, role) =>
  WorkspaceMember.findOneAndUpdate(
    { userId, workspaceId, isActive: true },
    { role },
    { new: true, runValidators: true }
  );

const deactivateMember = (userId, workspaceId) =>
  WorkspaceMember.findOneAndUpdate(
    { userId, workspaceId },
    { isActive: false },
    { new: true }
  );

module.exports = {
  findMember, findMemberAny, findUserWorkspaces, findMembers, isMember,
  createMember, reactivateMember, updateMemberRole, deactivateMember,
};
