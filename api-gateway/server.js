const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./src/config/environment');
const authMiddleware = require('./src/middlewares/auth.middleware');
const { globalLimiter } = require('./src/middlewares/rateLimit.middleware');
const routes = require('./src/routes/index');

const app = express();

// ─── Security & Utility Middleware ───────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Global Rate Limit ────────────────────────────────────────────────────────
app.use(globalLimiter);

// ─── Auth (trước khi vào routes) ─────────────────────────────────────────────
// PUBLIC_PATHS được whitelist bên trong authMiddleware
app.use(authMiddleware);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_, res) =>
  res.json({ success: true, service: 'api-gateway', status: 'UP' })
);

// ─── API Routes ───────────────────────────────────────────────────────────────
// Tất cả route đều có prefix /api
// /api/iam/**   → iam-service
// /api/core/**  → core-service
// /api/bff/**   → bff-service
app.use('/api', routes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) =>
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  })
);

// ─── Global Error Handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[GATEWAY ERROR]', err);
  res.status(500).json({
    success: false,
    message: 'Internal gateway error',
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(env.PORT, () => {
  console.log(`[api-gateway] running on port ${env.PORT} (${env.NODE_ENV})`);
  console.log(`  /api/iam  → ${env.IAM_SERVICE_URL}`);
  console.log(`  /api/core → ${env.CORE_SERVICE_URL}`);
  console.log(`  /api/bff  → ${env.BFF_SERVICE_URL}`);
});
