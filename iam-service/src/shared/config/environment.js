require('dotenv').config();

const env = {
  PORT:      process.env.PORT      || 3001,
  NODE_ENV:  process.env.NODE_ENV  || 'development',

  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/iam_service',

  JWT_SECRET:           process.env.JWT_SECRET           || 'dev_access_secret',
  JWT_EXPIRES_IN:       process.env.JWT_EXPIRES_IN        || '15m',
  JWT_REFRESH_SECRET:   process.env.JWT_REFRESH_SECRET   || 'dev_refresh_secret',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,

  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@yourapp.com',

  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};

module.exports = env;
