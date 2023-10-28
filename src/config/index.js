const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

exports.BASE_PATH = path.normalize(path.join(__dirname, '..'));
// console.log(path.normalize(path.join(__dirname, '..')));
exports.PROJECT_MODE = process.env.PROJECT_MODE;
exports.PROJECT_NAME = process.env.PROJECT_NAME;
exports.SERVER_HOSTNAME = process.env.SERVER_HOSTNAME;
exports.SERVER_PORT = process.env.SERVER_PORT;
exports.SWAGGER_HOSTNAME = process.env.SWAGGER_HOSTNAME;
exports.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
exports.MONGODB_HOSTNAME = process.env.MONGODB_HOSTNAME;
exports.MONGODB_PORT = process.env.MONGODB_PORT;
exports.MONGODB_DATABASE = process.env.MONGODB_DATABASE;
exports.MONGODB_USERNAME = process.env.MONGODB_USERNAME;
exports.MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
exports.REDIS_HOSTNAME = process.env.REDIS_HOSTNAME;
exports.REDIS_HOSTNAME_DEV = process.env.REDIS_HOSTNAME_DEV;
exports.REDIS_PORT = process.env.REDIS_PORT;
exports.REDIS_PASSWORD = process.env.REDIS_PASSWORD;
exports.AUTH_EMAIL = process.env.AUTH_EMAIL;
exports.AUTH_PASS = process.env.AUTH_PASS;
exports.CLIENT_HOSTNAME = process.env.CLIENT_HOSTNAME;
exports.REDIS_TTL = {
    trimester: 7776000
};
