const workspaceService = require('./workspace.service');
const response         = require('../../shared/utils/response');

const createWorkspace = async (req, res, next) => {
  try {
    const workspace = await workspaceService.createWorkspace(req.user.userId, req.body);
    return response.created(res, workspace, 'Workspace created');
  } catch (err) { next(err); }
};

const getMyWorkspace = async (req, res, next) => {
  try {
    const workspace = await workspaceService.getMyWorkspace(req.user.userId);
    return response.ok(res, workspace);
  } catch (err) { next(err); }
};

const getWorkspaceById = async (req, res, next) => {
  try {
    const workspace = await workspaceService.getWorkspaceById(req.params.id);
    return response.ok(res, workspace);
  } catch (err) { next(err); }
};

const updateWorkspace = async (req, res, next) => {
  try {
    const workspace = await workspaceService.updateWorkspace(
      req.user.userId,
      req.user.role,
      req.params.id,
      req.body,
    );
    return response.ok(res, workspace, 'Workspace updated');
  } catch (err) { next(err); }
};

const addMember = async (req, res, next) => {
  try {
    const member = await workspaceService.addMember(
      req.user.userId,
      req.user.role,
      req.params.id,
      req.body.userId,
    );
    return response.ok(res, member, 'Member added');
  } catch (err) { next(err); }
};

const removeMember = async (req, res, next) => {
  try {
    await workspaceService.removeMember(
      req.user.userId,
      req.user.role,
      req.params.id,
      req.params.memberId,
    );
    return response.ok(res, null, 'Member removed');
  } catch (err) { next(err); }
};

module.exports = {
  createWorkspace,
  getMyWorkspace,
  getWorkspaceById,
  updateWorkspace,
  addMember,
  removeMember,
};
