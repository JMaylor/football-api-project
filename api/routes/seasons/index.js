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
      tags: ["seasons"],
      description: "Get all seasons",
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            required: [
              "season_id",
              "season_name",
              "competition_code",
              "competition_name",
            ],
            properties: {
              season_id: { type: "integer" },
              season_name: { type: "string" },
              competition_code: { type: "string" },
              competition_name: { type: ["string", "null"] },
            },
          },
        },
      },
    },
    handler: async (_req, reply) => {
      const client = await fastify.pg.connect();
      const { rows } = await client.query(
        `SELECT
          s.season_id,
          s.season_name,
          c.competition_code,
          c.competition_name
        FROM season s
          JOIN competition c
            USING (competition_code);`
      );
      client.release();
      reply.send(rows);
    },
  });


  fastify.route({
    method: "GET",
    url: "/:competitionCode",
    schema: {
      tags: ["seasons"],
      description: "Get all seasons for a certain competition",
      params: {
        competitionCode: { type: "string" },
      },
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            required: ["season_id", "season_name"],
            properties: {
              season_id: { type: "integer" },
              season_name: { type: "string" },
            },
          },
        },
      },
    },
    handler: async (req, reply) => {
      const { competitionCode } = req.params;
      const client = await fastify.pg.connect();
      const { rows } = await client.query(
        `SELECT
          s.season_id,
          s.season_name
        FROM season s
          WHERE s.competition_code = $1;`,
        [
          competitionCode
        ]
      );
      client.release();
      reply.send(rows);
    },
  });
}

