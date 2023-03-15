import chalk from 'chalk'
import { PROJECT_MODE, SERVER_HOSTNAME, SERVER_PORT } from './config/index.js'
import { init, app } from './app.js'
;(async () => {
    try {
        await init()

        app.listen(SERVER_PORT, () => {
            console.log(
                `-------\n${chalk.black.bgGreenBright(
                    `🚀 Server is ready!`
                )}\nmode: ${chalk.blueBright(
                    `${PROJECT_MODE}`
                )}\nserver: ${chalk.blueBright(
                    `http://${SERVER_HOSTNAME}:${SERVER_PORT}`
                )}\n-------`
            )
        })
    } catch (err) {
        console.log(`${chalk.red.bold(err)}`)
    }
})()
