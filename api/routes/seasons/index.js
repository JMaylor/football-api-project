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
          *
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
        type: 'object',
        properties: {
          competitionCode: { type: 'string' }
        }
      },
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
    handler: async (req, reply) => {
      const { competitionCode } = req.params;
      const client = await fastify.pg.connect();
      const { rows } = await client.query(
        `SELECT
          *
        FROM season s
          JOIN competition c
            USING (competition_code)
        WHERE s.competition_code = $1;`,
        [
          competitionCode
        ]
      );
      client.release();
      if (rows.length === 0) {
        reply.callNotFound()
      } else {
        reply.send(rows);
      }
    },
  });
}

