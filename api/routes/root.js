/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
 export default async (fastify, options) => {
  fastify.route({
    method: "GET",
    url: "/",
    schema: {
      tags: ["healthcheck"],
      description: "Healthcheck",
      response: {
        200: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              default: 'available'
            },
          },
        },
        503: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              default: 'unavailable'
            },
          },
        },
      },
    },
    handler: async (_req, reply) => {
      try {
        const client = await fastify.pg.connect();
        client.release()
        reply.send({status: 'available'});
      } catch(error) {
        reply.status(503).send({status: 'unavailable'});
      }
    },
  });
}
