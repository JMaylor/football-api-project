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
          required: ["foo"],
          properties: {
            foo: { type: "string" },
          },
        },
      },
    },
    handler: async (_req, reply) => {
      reply.send({foo: 'bar'});
    },
  });
}
