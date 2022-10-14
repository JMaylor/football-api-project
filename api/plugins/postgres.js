import fastifyPlugin from 'fastify-plugin'

console.log('reading CA_CERT', process.env.CA_CERT)

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
