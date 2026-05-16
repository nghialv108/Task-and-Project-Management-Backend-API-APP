const app = require('./app');
const env = require('./src/shared/config/environment');
const { connect } = require('./src/shared/config/db');

const start = async () => {
  await connect();

  app.listen(env.PORT, () => {
    console.log(`[iam-service] running on port ${env.PORT} (${env.NODE_ENV})`);
  });
};

start();
