import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

const swagger = async (app) => {
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: ' Dogestagram API with Swagger',
                version: '0.1.0',
                description:
                    'Dogestagram made with Express, Redis and documented with Swagger',
                contact: {
                    name: 'Lefju',
                    url: 'https://lefju.onrender.com',
                    email: 'karol.legut121@email.com'
                }
            },
            servers: [
                {
                    url: 'http://localhost:5000/api'
                }
            ]
        },
        apis: [
            './src/api/routers/*.js',
            './src/api/controllers/*.js',
            './src/api/models/*.js'
        ]
    }

    const specs = swaggerJsdoc(options)
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
}

export default swagger
