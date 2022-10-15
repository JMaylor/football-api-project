import fastifyPlugin from 'fastify-plugin'

export default fastifyPlugin(async (fastify, _options) => {
  fastify.register(import('@fastify/sensible'))
})
