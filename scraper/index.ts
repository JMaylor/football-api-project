import axios from 'axios'
import Papa from 'papaparse'
import { Client } from 'pg'
import fs from 'fs'
import { parse, format } from 'date-fns'

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

  // /* Scotland */
  // 'SC0',
  // 'SC1',
  // 'SC2',
  // 'SC3',

  // /* Netherlands */
  // 'N1',

  // /* Belgium */
  // 'B1',

  // /* Portugal */
  // 'P1',

  // /* Turkey */
  // 'T1',

  // /* Greece */
  // 'G1',
]

const badRows: any[] = []

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
    connectionString: process.env.POSTGRES_CONNECTION_URI,
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
  await client.query('INSERT INTO competition (competition_code) VALUES ($1) ON CONFLICT DO NOTHING;', [competition])
}

async function addSeason({ competition, season, client }: { competition: string, season: string, client: Client }) {
  const { rows } = await client.query('INSERT INTO season (competition_code, season_name) VALUES ($1, $2) ON CONFLICT DO NOTHING returning season_id;', [competition, season])
  return rows[0].season_id
}

async function addFixture({ fixture, seasonId, client }: { fixture: any, seasonId: number, client: Client }) {
  /* The following fields are required to insert a fixture:
  home team
  away team
  date
  full time home goals
  full time away goals
  */

  const homeTeam = Object.hasOwn(fixture, 'HomeTeam') ? fixture.HomeTeam : Object.hasOwn(fixture, 'HT') ? fixture.HT : null
  const awayTeam = Object.hasOwn(fixture, 'AwayTeam') ? fixture.AwayTeam : Object.hasOwn(fixture, 'AT') ? fixture.AT : null

  const rawFixtureDate = fixture.Date
  const parseFormat = rawFixtureDate.length === 8 ? 'dd/MM/yy' : 'dd/MM/yyyy'
  const fixtureDate = fixture.Date ? format(parse(fixture.Date, parseFormat, new Date()), 'yyyy-MM-dd') : null
  const fullTimeHomeGoals = Object.hasOwn(fixture, 'FTHG') ? fixture.FTHG : Object.hasOwn(fixture, 'HG') ? fixture.HG : null
  const fullTimeAwayGoals = Object.hasOwn(fixture, 'FTAG') ? fixture.FTAG : Object.hasOwn(fixture, 'AG') ? fixture.AG : null
  const referee = fixture.Referee || null
  const homeShots = fixture.HS === '' ? null : fixture.HS
  const awayShots = fixture.AS === '' ? null : fixture.AS
  const homeShotsOnTarget = fixture.HST === '' ? null : fixture.HST
  const awayShotsOnTarget = fixture.AST === '' ? null : fixture.AST
  const homeFouls = fixture.HF === '' ? null : fixture.HF
  const awayFouls = fixture.AF === '' ? null : fixture.AF
  const homeCorners = fixture.HC === '' ? null : fixture.HC
  const awayCorners = fixture.AC === '' ? null : fixture.AC
  const homeYellows = fixture.HY === '' ? null : fixture.HY
  const awayYellows = fixture.AY === '' ? null : fixture.AY
  const homeReds = fixture.HR === '' ? null : fixture.HR
  const awayReds = fixture.AR === '' ? null : fixture.AR
  const halfTimeHomeGoals = fixture.HTHG === '' ? null : fixture.HTHG
  const halfTimeAwayGoals = fixture.HTAG === '' ? null : fixture.HTAG

  try {
    await client.query(`
        INSERT INTO fixture (
          home_team_name,
          away_team_name,
          fixture_date,
          season_id,
          full_time_home_goals,
          full_time_away_goals,
          referee_name,
          home_shots,
          away_shots,
          home_shots_on_target,
          away_shots_on_target,
          home_fouls,
          away_fouls,
          home_corners,
          away_corners,
          home_yellows,
          away_yellows,
          home_reds,
          away_reds,
          half_time_home_goals,
          half_time_away_goals
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11,
            $12,
            $13,
            $14,
            $15,
            $16,
            $17,
            $18,
            $19,
            $20,
            $21
        ) ON CONFLICT DO NOTHING;
      `,
      [
        homeTeam,
        awayTeam,
        fixtureDate,
        seasonId,
        fullTimeHomeGoals,
        fullTimeAwayGoals,
        referee,
        homeShots,
        awayShots,
        homeShotsOnTarget,
        awayShotsOnTarget,
        homeFouls,
        awayFouls,
        homeCorners,
        awayCorners,
        homeYellows,
        awayYellows,
        homeReds,
        awayReds,
        halfTimeHomeGoals,
        halfTimeAwayGoals,

      ])
  } catch (error) {
    badRows.push({
      error,
      seasonId,
      fixture
    })
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
          if (fixture.Referee) await addReferee({ referee: fixture.Referee, client })

          // add the fixture
          await addFixture({ fixture, seasonId, client })
        }
      }
    }
  }
  client.end()

  await fs.writeFile("badRows.json", JSON.stringify(badRows), function (err) {
    if (err) {
      console.log(err);
    }
  })
}

fetchAllData()
