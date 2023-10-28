const fs = require('fs');
const { fileURLToPath } = require('url');
const { join } = require('path');
const { BASE_PATH } = require('../config/index.js');

exports.routes = async app => {
    const routerPath = `${BASE_PATH}/api/routers`;
    const files = fs.readdirSync(routerPath);

    files.forEach(route => {
        const routeModule = require(`${routerPath}/${route}`);

        if (typeof routeModule === 'function') {
            routeModule(app);
        } else if (typeof routeModule.default === 'function') {
            routeModule.default(app);
        } else {
            console.error(`Invalid module export for route: ${route}`);
        }
    });
};
