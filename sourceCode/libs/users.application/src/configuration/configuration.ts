export default () => ({
    dev: {
        environmentname: process.env.DEV_ENV_NAME,
        web: {
            protocol: process.env.DEV_WEB_PROTOCOL,
            host: process.env.DEV_WEB_HOST,
            port: process.env.DEV_WEB_PORT,
        },
        database: {
                    host: process.env.DEV_DATABASE_HOST,
                    port: parseInt(process.env.DEV_DATABASE_PORT, 10) || 27017,
                    name: process.env.DEV_DATABASE_NAME,
                    user: process.env.DEV_DATABASE_USER,
                    password: process.env.DEV_DATABASE_PASSWORD,
                    authDatabase: process.env.DEV_AUTHDATABASE_NAME,
                },
                microservice: {
                    protocol: process.env.DEV_MICROSERVICE_PROTOCOL,
                    port: process.env.DEV_MICROSERVICE_PORT,
                    host: process.env.DEV_MICROSERVICE_HOST,
                },
    },
    prod : {

    },
  });
