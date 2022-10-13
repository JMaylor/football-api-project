/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
 export default async (fastify, options) => {
  fastify.route({
    method: "GET",
    url: "/:seasonId",
    schema: {
      tags: ["table"],
      description: "Get final league table for a given season",
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            required: ["team", "played", "won", "drawn", "lost", "scored", "conceded", "difference", "points"],
            properties: {
              team: { type: "string" },
              played: { type: "integer" },
              won: { type: "integer" },
              drawn: { type: "integer" },
              lost: { type: "integer" },
              scored: { type: "integer" },
              conceded: { type: "integer" },
              difference: { type: "integer" },
              points: { type: "integer" },
            },
          },
        },
      },
    },
    handler: async (req, reply) => {
      const { seasonId } = req.params;
      const client = await fastify.pg.connect();
      const { rows } = await client.query(`select * from league_table($1)`,[seasonId]);
      client.release();
      reply.send(rows);
    },
  });
}
