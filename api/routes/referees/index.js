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
      description: "Get all referees, and the number of games they have officiated",
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            required: [
              "referee_name",
              "count"
            ],
            properties: {
              referee_name: { type: "string" },
              count: { type: "integer" },
            },
          },
        },
      },
    },
    handler: async (_req, reply) => {
      const client = await fastify.pg.connect();
      const { rows } = await client.query(
        `SELECT
          referee_name,
          count(*)
        FROM referee
        JOIN fixture
          USING (referee_name)
        GROUP BY (referee_name);`
      );
      client.release();
      reply.send(rows);
    },
  });
}
