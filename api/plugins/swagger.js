import fastifyPlugin from 'fastify-plugin'

export default fastifyPlugin(async (fastify, _options) => {
  fastify.register(import('@fastify/swagger'), {
    swagger: {
      info: {
        title: "Maylor Football Data API",
        description: "An API for Football Data",
        version: "0.1.0",
      },
      externalDocs: {
        url: "https://www.football.maylor.io",
        description: "Read more about this API on my blog.",
      },
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'competition', description: 'competition related end-points' },
      ],
      definitions: {
        competition: {
          type: 'object',
          required: ['competition_code', 'competition_name'],
          properties: {
            competition_code: { type: 'string' },
            competition_name: { type: 'string' },
          }
        }
      },
    }
  })

  fastify.register(import('@fastify/swagger-ui'), {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (request, reply, next) { next() },
      preHandler: function (request, reply, next) { next() }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  })
})
