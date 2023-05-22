const chalk = require('chalk');
const {
    PROJECT_MODE,
    SERVER_HOSTNAME,
    SERVER_PORT
} = require('./config/index.js');
const { init, app } = require('./app.js');

(async () => {
    try {
        await init();

        app.listen(SERVER_PORT, () => {
            console.log(
                `-------\n${chalk.black.bgGreenBright(
                    `🚀 Server is ready!`
                )}\nmode: ${chalk.blueBright(
                    `${PROJECT_MODE}`
                )}\nserver: ${chalk.blueBright(
                    `http://${SERVER_HOSTNAME}:${SERVER_PORT}`
                )}\n-------`
            );
        });
    } catch (err) {
        console.log(err);
    }
})();
