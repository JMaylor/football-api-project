# Populating the data

So with a data source and a database scaffolded to hold the data, all that was left to do was pull the data, bash it into the correct shape, and insert it into my database.

By looking at some of the urls, we can see that luckily the only variables are the league and season.

| Season  | League  | URL                                                   |
| ------- | ------- | ----------------------------------------------------- |
| 2018/19 | Serie A | `https://football-data.co.uk/mmz4281/1819/I1.csv`     |
| 2004/05 | La Liga | `https://football-data.co.uk/mmz4281/0405/SP1.csv`    |
| ...     | ...     | ...                                                   |
| `foo`   | `bar`   | `https://football-data.co.uk/mmz4281/{foo}/{bar}.csv` |

Each league has a code combining the country it's based in, and the tier of football.

Say we want to get the data and populate it in our database for one of these files. First we need to fetch the data (I used axios for this, but you can also use node-fetch or some other ajax implementation).

Next, we need to parse this csv file into something we can more easily work with, like JSON. I used PapaParse for this but there are a number of different options. Finally, we can insert the competition, season, referee, team and fixture data.

Here's the basic idea:

```ts
import axios from 'axios'
import Papa from 'papaparse'
import { Client } from 'pg'

// fetch the csv data from the url
const csvData = await axios.get('https://football-data.co.uk/mmz4281/1819/E0.csv')

// parse the data into json
const fixtureData = await Papa.parse(csvData)

// connect to our database
const client = new Client({
  connectionString
})
await client.connect()

// create the competition
createCompetition()

// create the season
const seasonId = createSeason()

// loop through the fixtures
for (const fixture of fixtureData) {
  // create the teams
  createTeam(fixture.homeTeam)
  createTeam(fixture.awayTeam)

  // create the referee
  createReferee(fixture.referee)

  // create the fixture
  createFixture({ fixture, seasonId })
}
```

All that's left to do is expand this so it runs for every single possible league / season combination.

Some issues we might run into:
* The file doesn't exist. If this happens, axios should throw an error, which we can catch. The data doesn't go back as far for some of the "less mainstream" leagues.
* The row data is incomplete. As an absolute minimum, we need the teams, the fixture date and the final score. Anything else is a bonus. We should check each row is valid before trying to insert it, though the database should reject any invalid rows anyway. There are 2 cases for an invalid row:
  1. It's an empty row. The csv file might contain some extra blank rows at the bottom. These aren't real fixtures, obviously, so we can discard them.
  2. The score is blank. It's not uncommon for fixtures to be postponed, but very occasionally a fixture might be cancelled altogether. Either one team went into administration and couldn't complete their fixtures, or a match might have been abandoned for safety reasons. In this case, we will need to find out what happened manually. If we encounter a row like this, we should add it to an array which is logged at the end of the script so we know what needs to be investigated, and manual fixtures added. Luckily, we can easily load the csv data into something like Google Sheets to easily see the erroneous row and determine what went wrong.

Here's a [link to the final script](https://github.com/JMaylor/football-api-project/blob/main/scraper/index.ts). 