import axios from 'axios'
import Papa from 'papaparse'
import { Client } from 'pg'

require('dotenv').config()

const seasons = [
  '2122',
  '2021',
  '1920',
  '1819',
  '1718',
  '1617',
  '1516',
  '1415',
  '1314',
  '1213',
  '1112',
  '1011',
  '0910',
  '0809',
  '0708',
  '0607',
  '0506',
  '0405',
  '0304',
  '0203',
  '0102',
  '0001',
  '9900',
  '9899',
  '9798',
  '9697',
  '9596',
  '9495',
  '9394'
]

const competitions = [
  /* England */
  'E0',
  'E1',
  'E2',
  'E3',
  'EC',

  /* Scotland */
  'SC0',
  'SC1',
  'SC2',
  'SC3',

  /* Germany */
  'D1',
  'D2',

  /* Italy */
  'I1',
  'I2',

  /* Spain */
  'SP1',
  'SP2',

  /* France */
  'FR1',
  'FR2',

  /* Netherlands */
  'N1',

  /* Belgium */
  'B1',

  /* Portugal */
  'P1',

  /* Turkey */
  'T1',

  /* Greece */
  'G1',
]

async function fetchSeasonData({ competition, season }: { competition: string, season: string }) {
  console.log(`%c ${season} -- ${competition}`, 'background: #222; color: #bada55')
  try {
    const { data } = await axios.get(`https://www.football-data.co.uk/mmz4281/${season}/${competition}.csv`)
    const jsonData = Papa.parse(data, {
      header: true,
      skipEmptyLines: true
    }).data
    return jsonData
  } catch (error) {
    if (axios.isAxiosError(error))
      console.log(`something went wrong when fetching the data.`)
    else {
      console.log(`something went wrong when parsing the data.`)
    }
  }
}

async function connectToDatabase() {
  const client = new Client({
    connectionString: process.env.POSTGRES_CONNECTION_URI
  })
  await client.connect()
  console.log('connected to database successfully!');
  return client
}

async function addTeam({ team, client }: { team: string, client: Client }) {
  await client.query('INSERT INTO team (team_name) VALUES ($1) ON CONFLICT DO NOTHING;', [team])
}

async function addReferee({ referee, client }: { referee: string, client: Client }) {
  await client.query('INSERT INTO referee (referee_name) VALUES ($1) ON CONFLICT DO NOTHING;', [referee])
}

async function addCompetition({ competition, client }: { competition: string, client: Client }) {
  await client.query('INSERT INTO competition (competition_name) VALUES ($1) ON CONFLICT DO NOTHING;', [competition])
}

async function addSeason({ competition, season, client }: { competition: string, season: string, client: Client }) {
  await client.query('INSERT INTO season (competition_name, season_name) VALUES ($1, $2) ON CONFLICT DO NOTHING;', [competition, season])
}

async function addFixture({ fixture, seasonId, client }: { fixture: any, seasonId: number, client: Client }) {
  if (!fixture.HomeTeam && !fixture.HT) return
  if (!fixture.FTR) return
  const { rowCount } = await client.query(`
    SELECT * FROM fixture WHERE home_team_name = $1 AND away_team_name = $2 and fixture_date = $3;
  `,
    [
      fixture.HomeTeam || fixture.HT,
      fixture.AwayTeam || fixture.AT,
      fixture.Date
    ])
  if (rowCount === 0) {
    await client.query(`
          INSERT INTO fixture (
            home_team_name,
            away_team_name,
            fixture_date,
            season_id,
            full_time_home_goals,
            full_time_away_goals,
            full_time_result,
            referee_name
          )
          VALUES (
              $1,
              $2,
              $3,
              $4,
              $5,
              $6,
              $7,
              $8
          )
        `,
      [
        fixture.HomeTeam || fixture.HT,
        fixture.AwayTeam || fixture.AT,
        fixture.Date,
        seasonId,
        fixture.FTHG,
        fixture.FTAG,
        fixture.FTR,
        fixture.Referee
      ])
  }
}

async function fetchAllData() {
  // initialise database connection
  const client = await connectToDatabase()

  // loop through all competitions
  for (const competition of competitions) {

    // add the competition to the database
    addCompetition({ competition, client })

    // loop through all seasons
    for (const season of seasons) {

      // get the season data
      const fixtureData = await fetchSeasonData({ competition, season })

      // if we got some data back
      if (fixtureData) {
        console.log(fixtureData.filter((f: any) => !!f.Date).length);

        // add the season and fetch the generated id
        const seasonId = await addSeason({ competition, season, client })

        // loop through all fixtures in the season
        for (const fixture of fixtureData as any[]) {
          if (!fixture.Div) continue

          // check if the teams exist and add them if not
          await addTeam({ team: fixture.HomeTeam || fixture.HT, client })
          await addTeam({ team: fixture.AwayTeam || fixture.AT, client })

          // add the referee
          await addReferee({ referee: fixture.Referee, client })

          // add the fixture
          await addFixture({ fixture, seasonId, client })
        }
      }
    }
  }
  client.end()
}

fetchAllData()
