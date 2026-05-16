const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./src/shared/config/environment');
const errorHandler = require('./src/shared/middlewares/errorHandler');

const authRoutes = require('./src/modules/auth/auth.routes');
const userRoutes = require('./src/modules/user/user.routes');
const workspaceRoutes = require('./src/modules/workspace/workspace.routes');

const app = express();

// ─── Security & Utility ───────────────────────────────────────────────────────
app.use(helmet());
// Chỉnh sửa cors chỉ cho phép Gateway truy cập, và chặn direct access từ client (nếu có)
app.use(cors());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_, res) =>
  res.json({ success: true, service: 'iam-service', status: 'UP' })
);

// ─── Routes — tất cả dưới prefix /iam ────────────────────────────────────────
//
//  Auth:
//    POST /iam/auth/register
//    POST /iam/auth/login
//    POST /iam/auth/refresh-token
//    POST /iam/auth/logout
//    POST /iam/auth/forgot-password
//    POST /iam/auth/reset-password
//    PUT  /iam/auth/change-password
//
//  Users:
//    GET    /iam/users/me
//    PUT    /iam/users/me
//    GET    /iam/users/:id
//    GET    /iam/users/workspace/:workspaceId/members
//    PATCH  /iam/users/:id/role
//    PATCH  /iam/users/:id/deactivate
//
//  Workspaces:
//    POST   /iam/workspaces
//    GET    /iam/workspaces/mine
//    GET    /iam/workspaces/:id
//    PUT    /iam/workspaces/:id
//    POST   /iam/workspaces/:id/members
//    DELETE /iam/workspaces/:id/members/:memberId

app.use('/iam/auth', authRoutes);
app.use('/iam/users', userRoutes);
app.use('/iam/workspaces', workspaceRoutes);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) =>
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  })
);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
