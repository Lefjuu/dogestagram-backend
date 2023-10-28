const express = require('express');
const { create } = require('./lib/express.lib.js');
const { routes } = require('./services/router.service.js');
const { connect: redis } = require('./lib/redis.lib.js');
const mongoose = require('./lib/mongoose.lib.js');
const { checkS3Connection } = require('./lib/aws.lib.js');

const app = express();

const init = async () => {
    // express
    await create(app);

    // redis
    await redis();

    // mongoose
    await mongoose();

    // aws
    await checkS3Connection();

    // routes
    await routes(app);
};

module.exports = { init, app };
