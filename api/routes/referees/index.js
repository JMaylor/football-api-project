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
      tags: ["referees"],
      description: "Get all referees",
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            required: [
              "referee_name",
            ],
            properties: {
              referee_name: { type: "string" },
            },
          },
        },
      },
    },
    handler: async (_req, reply) => {
      const client = await fastify.pg.connect();
      const { rows } = await client.query(
        `SELECT
          *
        FROM referee;`
      );
      client.release();
      reply.send(rows);
    },
  });
}
