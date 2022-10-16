const response = {
  200: {
    type: "array",
    items: {
      type: "object",
      required: [
        "fixture_id",
        "home_team_name",
        "away_team_name",
        "fixture_date",
        "season_id",
        "full_time_home_goals",
        "full_time_away_goals",
        "half_time_home_goals",
        "half_time_away_goals",
        "referee_name",
        "home_shots",
        "away_shots",
        "home_shots_on_target",
        "away_shots_on_target",
        "home_fouls",
        "away_fouls",
        "home_corners",
        "away_corners",
        "home_yellows",
        "away_yellows",
        "home_reds",
        "away_reds",
        "season_name",
        "competition_code",
        "competition_name",
      ],
      properties: {
        fixture_id: {type: "integer"},
        home_team_name: {type: "string"},
        away_team_name: {type: "string"},
        fixture_date: {type: "string", format: "date"},
        season_id: {type: "integer"},
        full_time_home_goals: {type: "integer"},
        full_time_away_goals: {type: "integer"},
        half_time_home_goals: {type: ["integer", "null"]},
        half_time_away_goals: {type: ["integer", "null"]},
        referee_name: {type: ["string", "null"]},
        home_shots: {type: ["integer", "null"]},
        away_shots: {type: ["integer", "null"]},
        home_shots_on_target: {type: ["integer", "null"]},
        away_shots_on_target: {type: ["integer", "null"]},
        home_fouls: {type: ["integer", "null"]},
        away_fouls: {type: ["integer", "null"]},
        home_corners: {type: ["integer", "null"]},
        away_corners: {type: ["integer", "null"]},
        home_yellows: {type: ["integer", "null"]},
        away_yellows: {type: ["integer", "null"]},
        home_reds: {type: ["integer", "null"]},
        away_reds: {type: ["integer", "null"]},
        season_name: { type: "string" },
        competition_code: { type: "string" },
        competition_name: { type: ["string", "null"] },
      },
    },
  },
}

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
 export default async (fastify, options) => {
  fastify.route({
    method: "GET",
    url: "/season/:seasonId",
    schema: {
      tags: ["fixtures"],
      description: "Get all fixtures for a given season",
      params: {
        type: 'object',
        properties: {
          seasonId: { type: 'integer' }
        }
      },
      response,
    },
    handler: async (req, reply) => {
      const { seasonId } = req.params;
      const client = await fastify.pg.connect();
      const { rows } = await client.query(`
        select *
        from fixture
        join season
          using (season_id)
        join competition
          using (competition_code)
        where season_id = $1;`,
        [seasonId]
      );
      client.release();
      if (rows.length === 0) {
        reply.callNotFound()
      } else {
        reply.send(rows);
      }
    },
  });

  fastify.route({
    method: "GET",
    url: "/team/:team",
    style: 'matrix',
    schema: {
      tags: ["fixtures"],
      description: "Get all fixtures for a given team",
      params: {
        type: 'object',
        properties: {
          team: { type: 'string' }
        }
      },
      response,
    },
    handler: async (req, reply) => {
      const { team } = req.params;
      const client = await fastify.pg.connect();
      const { rows } = await client.query(`
        select *
        from fixture
        join season
          using (season_id)
        join competition
          using (competition_code)
        where home_team_name = $1
          or away_team_name = $1;
        `,
        [team]
      );
      client.release();
      if (rows.length === 0) {
        reply.callNotFound()
      } else {
        reply.send(rows);
      }
    },
  });

  fastify.route({
    method: "GET",
    url: "/head-to-head/:teamOne/:teamTwo",
    style: 'matrix',
    schema: {
      tags: ["fixtures"],
      description: "Get all fixtures between two teams",
      params: {
        type: 'object',
        properties: {
          teamOne: { type: 'string' },
          teamTwo: { type: 'string' },
        }
      },
      response,
    },
    handler: async (req, reply) => {
      console.log('hi')
      const { teamOne, teamTwo } = req.params;
      console.log(teamOne, teamTwo)
      const client = await fastify.pg.connect();
      
      const { rows } = await client.query(`
        select *
        from fixture
        join season
          using (season_id)
        join competition
          using (competition_code)
        where (home_team_name = $1
          and away_team_name = $2)
          or (home_team_name = $2
            and away_team_name = $1);
        `,
        [teamOne, teamTwo]
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
