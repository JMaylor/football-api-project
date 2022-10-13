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
      tags: ["competitions"],
      description: "Get all competitions",
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            required: ["competition_code", "competition_name", "seasons_url"],
            properties: {
              competition_code: { type: "string" },
              competition_name: { type: ["string", "null"] },
              seasons_url: { type: "string", format: "uri" },
            },
          },
        },
      },
    },
    handler: async (_req, reply) => {
      const client = await fastify.pg.connect();
      const { rows } = await client.query(`SELECT * FROM competition;`);
      client.release();
      reply.send(
        rows.map((row) => ({
          ...row,
          seasons_url: `/seasons/${row.competition_code}`,
        }))
      );
    },
  });
}

