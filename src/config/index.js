const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

exports.BASE_PATH = path.normalize(path.join(__dirname, '..'));
exports.PROJECT_MODE = process.env.PROJECT_MODE;
exports.PROJECT_NAME = process.env.PROJECT_NAME;

exports.SERVER_HOSTNAME = process.env.SERVER_HOSTNAME;
exports.SERVER_PORT = process.env.SERVER_PORT;

exports.SWAGGER_HOSTNAME = process.env.SWAGGER_HOSTNAME;

exports.JWT_SECRET_ACCESS_KEY = process.env.JWT_SECRET_ACCESS_KEY;
exports.JWT_SECRET_REFRESH_KEY = process.env.JWT_SECRET_REFRESH_KEY;
exports.JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN;
exports.JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;
exports.JWT_COOKIE_EXPIRES_IN = process.env.JWT_COOKIE_EXPIRES_IN;

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

exports.EMAIL_FROM = process.env.EMAIL_FROM;
exports.EMAIL_HOST = process.env.EMAIL_HOST;
exports.EMAIL_PORT = process.env.EMAIL_PORT;
exports.EMAIL_USERNAME = process.env.EMAIL_USERNAME;
exports.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

exports.CLIENT_HOSTNAME = process.env.CLIENT_HOSTNAME;
exports.REDIS_TTL = {
    trimester: 7776000
};
