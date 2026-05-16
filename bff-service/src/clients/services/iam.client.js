const http = require('../http/httpClient');
const env  = require('../../shared/config/environment');

const BASE = env.IAM_SERVICE_URL;

/**
 * IAM Client — tất cả call đến iam-service đi qua đây.
 * Path prefix /iam/* khớp với route của iam-service.
 */

const getProfile = (user) =>
  http.get(BASE, `/iam/users/me`, user);

const getUserById = (userId, user) =>
  http.get(BASE, `/iam/users/${userId}`, user);

const getWorkspaceMembers = (workspaceId, user) =>
  http.get(BASE, `/iam/users/workspace/${workspaceId}/members`, user);

const getMyWorkspace = (user) =>
  http.get(BASE, `/iam/workspaces/mine`, user);

module.exports = {
  getProfile,
  getUserById,
  getWorkspaceMembers,
  getMyWorkspace,
};
