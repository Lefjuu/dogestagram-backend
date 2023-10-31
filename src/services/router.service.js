const fs = require('fs');
const { BASE_PATH } = require('../config/index.js');
const globalErrorHandler = require('../utils/errors/ErrorHandler.js');
const AppError = require('../utils/errors/AppError.js');

exports.routes = async app => {
    const routerPath = `${BASE_PATH}/api/routers`;
    const files = fs.readdirSync(routerPath);

    files.forEach(async route => {
        const routeModule = require(`${routerPath}/${route}`);

        if (typeof routeModule === 'function') {
            await routeModule(app);
        } else if (typeof routeModule.default === 'function') {
            await routeModule.default(app);
        } else {
            console.error(`Invalid module export for route: ${route}`);
        }
        app.use(globalErrorHandler);
    });
    app.all('*', (req, res, next) => {
        next(
            new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
        );
    });
};
