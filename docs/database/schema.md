# Database Schema

As previously mentioned, the idea is to load the data from [football-data.co.uk](https://www.football-data.co.uk/data.php), who supply CSV files for many leagues and seasons. Each CSV file contained information about all the matches played in a given league season, including the teams, the score, and who the referee was.

We'll be splitting the data into six main models/tablesMost of the tables are fairly self-explanatory. The `deduction` table will hold any points deductions issued by governing authorities. This will help when calculating final league tables for a season.

| Table       | e.g.                                  |
| ----------- | ------------------------------------- |
| competition | Premier League                        |
| season      | 1994/95                               |
| referee     | Stuart Attwell                        |
| team        | Wolfsburg                             |
| fixture     | Liverpool 9 - 0 Bournemouth, 27-08-22 |
| deduction   | Luton, 2008/09, 30 points             |

These deductions are 

. You can read the complete definition of the database in the [schema.psql](https://github.com/JMaylor/football-api-project/blob/main/database/schema.psql) file in the project repository. I also created a visual database diagram using a great tool, [drawsql.app](https://drawsql.app/teams/joes-team-2/diagrams/football), which you can see below.

Aside from these tables, we'll also have 1 database function, which we'll use to calculate the final league table for a given season.

<iframe width="100%" height="500px" style="box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); border-radius:15px;" allowtransparency="true" allowfullscreen="true" scrolling="no" title="Embedded DrawSQL IFrame" frameborder="0" src="https://drawsql.app/teams/joes-team-2/diagrams/football/embed"></iframe>
