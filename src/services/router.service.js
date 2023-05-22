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

// Controllers Auth
// fs.readdirSync(`${BASE_PATH}/auth/routers`).forEach(route => {
//     require(`${BASE_PATH}/auth/routers/${route}`).default(app);
// });
// const fs = require('fs');
// const { fileURLToPath } = require('url');
// const { join } = require('path');
// const { BASE_PATH } = require('../config/index.js');

// module.exports = async function routes(app) {
//     fs.readdirSync(join(BASE_PATH, 'api/routers')).forEach(route => {
//         const routeURL = new URL(
//             `file://${join(BASE_PATH, 'api/routers', route)}`
//         );
//         const routePath = fileURLToPath(routeURL);
//         const currentModule = require(routePath);
//         if (typeof currentModule === 'object') {
//             // Assuming the module exports an object with named exports
//             for (const key in currentModule) {
//                 if (typeof currentModule[key] === 'function') {
//                     currentModule[key](app);
//                 }
//             }
//         }
//     });
// };
