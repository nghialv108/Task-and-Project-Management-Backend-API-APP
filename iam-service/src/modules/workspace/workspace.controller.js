const workspaceService = require('./workspace.service');
const response         = require('../../shared/utils/response');

const createWorkspace = async (req, res, next) => {
  try {
    const workspace = await workspaceService.createWorkspace(req.user.userId, req.body);
    return response.created(res, workspace, 'Workspace created');
  } catch (err) { next(err); }
};

const getMyWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await workspaceService.getMyWorkspaces(req.user.userId);
    return response.ok(res, workspaces);
  } catch (err) { next(err); }
};

const getWorkspaceById = async (req, res, next) => {
  try {
    const workspace = await workspaceService.getWorkspaceById(req.user.userId, req.params.id);
    return response.ok(res, workspace);
  } catch (err) { next(err); }
};

const updateWorkspace = async (req, res, next) => {
  try {
    const workspace = await workspaceService.updateWorkspace(
      req.user.userId,
      req.params.id,
      req.body,
    );
    return response.ok(res, workspace, 'Workspace updated');
  } catch (err) { next(err); }
};

// ─── Member management ────────────────────────────────────────────────────────

const getMembers = async (req, res, next) => {
  try {
    const members = await workspaceService.getMembers(req.user.userId, req.params.id);
    return response.ok(res, members);
  } catch (err) { next(err); }
};

const addMember = async (req, res, next) => {
  try {
    const member = await workspaceService.addMember(
      req.user.userId,
      req.params.id,
      req.body.userId,
      req.body.role,
    );
    return response.ok(res, member, 'Member added');
  } catch (err) { next(err); }
};

const removeMember = async (req, res, next) => {
  try {
    await workspaceService.removeMember(
      req.user.userId,
      req.params.id,
      req.params.memberId,
    );
    return response.ok(res, null, 'Member removed');
  } catch (err) { next(err); }
};

const updateMemberRole = async (req, res, next) => {
  try {
    const member = await workspaceService.updateMemberRole(
      req.user.userId,
      req.params.id,
      req.params.memberId,
      req.body.role,
    );
    return response.ok(res, member, 'Member role updated');
  } catch (err) { next(err); }
};

// ─── Internal endpoints — chỉ gateway gọi ────────────────────────────────────

const getMemberContext = async (req, res, next) => {
  try {
    const ctx = await workspaceService.getMemberContext(
      req.query.userId,
      req.query.workspaceId,
    );
    if (!ctx) return response.ok(res, null, 'Not a member');
    return response.ok(res, ctx);
  } catch (err) { next(err); }
};

const invalidateMemberCache = async (req, res, next) => {
  try {
    const { invalidateMemberCache: invalidate } = require('../../shared/utils/cacheInvalidator');
    const { userId, workspaceId } = req.body;
    if (!userId || !workspaceId)
      return res.status(400).json({ success: false, message: 'userId and workspaceId required' });
    invalidate(String(userId), String(workspaceId));
    return response.ok(res, null, 'Cache invalidation triggered');
  } catch (err) { next(err); }
};

module.exports = {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  getMembers,
  addMember,
  removeMember,
  updateMemberRole,
  getMemberContext,
  invalidateMemberCache,
};
