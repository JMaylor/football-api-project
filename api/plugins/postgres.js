import fastifyPlugin from 'fastify-plugin'

export default fastifyPlugin(async (fastify, _options) => {
  fastify.register(import('@fastify/postgres'), {
    ssl: {
      require: true,
      rejectUnauthorized: process.env.NODE_ENV !== 'development',
      ca: process.env.CA_CERT
    }
  })
})
