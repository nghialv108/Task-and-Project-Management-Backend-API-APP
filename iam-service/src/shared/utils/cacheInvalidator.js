const axios = require('axios');
const env   = require('../config/environment');

/**
 * Trigger xóa cache membership trên Gateway.
 * Fire-and-forget — nếu gateway không phản hồi, cache sẽ tự expire theo TTL.
 *
 * @param {string} userId
 * @param {string} workspaceId
 */
const invalidateMemberCache = (userId, workspaceId) => {
  axios.post(
    `${env.GATEWAY_URL}/internal/cache/invalidate`,
    { userId, workspaceId },
    { headers: { 'x-internal-secret': env.INTERNAL_SECRET }, timeout: 2000 }
  ).catch((err) => {
    // Log nhưng không throw — cache invalidation failure không block request
    console.warn('[CacheInvalidator] Failed to notify gateway:', err.message);
  });
};

module.exports = { invalidateMemberCache };
