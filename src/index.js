const chalk = require('chalk');
const {
    PROJECT_MODE,
    SERVER_HOSTNAME,
    SERVER_PORT
} = require('./config/index.js');
const { init, app } = require('./app.js');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

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

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('💥 Process terminated!');
    });
});
