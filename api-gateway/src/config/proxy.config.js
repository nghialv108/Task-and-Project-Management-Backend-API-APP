const env = require('./environment');

/**
 * Service Registry
 * Mỗi entry định nghĩa:
 *   - url:         URL của downstream service
 *   - pathRewrite: Rewrite path trước khi forward
 *                  VD: /api/iam/login → /iam/login
 */
const SERVICE_REGISTRY = {
  iam: {
    url: env.IAM_SERVICE_URL,
  },
  core: {
    url: env.CORE_SERVICE_URL,
    pathRewrite: '/core',
  },
  bff: {
    url: env.BFF_SERVICE_URL,
    pathRewrite: '/bff',
  },
};

module.exports = { SERVICE_REGISTRY };
