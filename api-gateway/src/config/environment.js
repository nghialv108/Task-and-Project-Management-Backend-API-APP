require('dotenv').config();

const env = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  INTERNAL_SECRET: process.env.INTERNAL_SECRET || 'dev_internal_secret',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret',
  JWT_SECRET_INTER_SERVICE: process.env.JWT_SECRET_INTER_SERVICE || 'dev_inter_service_secret',
  IAM_SERVICE_URL: process.env.IAM_SERVICE_URL || 'http://localhost:3001',
  CORE_SERVICE_URL: process.env.CORE_SERVICE_URL || 'http://localhost:3002',
  BFF_SERVICE_URL: process.env.BFF_SERVICE_URL || 'http://localhost:3003',

  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX) || 100,
};

module.exports = env;
