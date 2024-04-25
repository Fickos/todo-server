module.exports = {
    serviceName: process.env.SERVICE_NAME ?? 'todo-server',
    database: {
      name: process.env.DB_NAME ?? 'todo-db',
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'root',
      host: process.env.DB_HOST_COMM ?? 'localhost',
      port: process.env.DB_PORT_COMM ?? '5432',
      dialect: 'postgres',
      timezone: 'utc'
    },
    corsSettings: {
      origin: process.env.SERVER_ORIGIN ?? '*',
      exposedHeaders: process.env.SERVER_EXPOSE_HEADERS?.split(',')
    },
    server: {
        host: process.env.SERVER_HOST ?? 'localhost',
        port: process.env.SERVER_PORT ?? 4000,
    }
}