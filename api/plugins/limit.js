import fastifyPlugin from 'fastify-plugin'

export default fastifyPlugin(async (fastify, options) => {
  fastify.register(import('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '1 minute'
  })
})
