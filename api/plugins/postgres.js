import fastifyPlugin from 'fastify-plugin'

export default fastifyPlugin(async (fastify, options) => {
  fastify.register(import('@fastify/postgres'), {
    user: process.env.USERNAME,
    host: process.env.HOSTNAME,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
      rejectUnauthorized: false,
    },
  })
})
