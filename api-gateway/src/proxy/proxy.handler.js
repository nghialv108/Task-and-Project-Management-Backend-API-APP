const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * Tạo proxy middleware cho một service cụ thể.
 *
 * @param {string} targetUrl   - URL của downstream service
 * @param {string} prefix      - Tiền tố để thêm vào path
 * @returns Express middleware
 */
const createServiceProxy = (targetUrl, prefix = '') =>
  createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      return prefix + path;
    },

    on: {
      // Log mỗi request được proxy
      proxyReq: (proxyReq, req) => {
        console.log(`[PROXY] ${req.method} ${req.path} → ${targetUrl}${proxyReq.path}`);
      },

      // Xử lý lỗi khi không kết nối được downstream service
      error: (err, req, res) => {
        console.error(`[PROXY ERROR] ${req.method} ${req.path}`, err.message);

        if (!res.headersSent) {
          res.status(502).json({
            success: false,
            message: 'Service temporarily unavailable. Please try again.',
          });
        }
      },
    },
  });

module.exports = { createServiceProxy };
