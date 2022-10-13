import fastifyPlugin from 'fastify-plugin'

export default fastifyPlugin(async (fastify, options) => {
  fastify.register(import('@fastify/sensible'))
})
