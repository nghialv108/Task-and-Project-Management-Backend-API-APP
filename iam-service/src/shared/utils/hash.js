const bcrypt = require('bcryptjs');
const env    = require('../config/environment');

const hash    = (plain)         => bcrypt.hash(plain, env.BCRYPT_SALT_ROUNDS);
const compare = (plain, hashed) => bcrypt.compare(plain, hashed);

module.exports = { hash, compare };
