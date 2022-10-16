# Tech Stack

## Workflow

Here was my very high level idea of how the app would look.

1. Load the data from [football-data.co.uk](https://www.football-data.co.uk/data.php) CSV files into a database.
2. Create a REST API to read data from the database.
3. Create a front end to consume the data and show it in a nice UI.

## Database

For the database, I chose [PostgreSQL](https://www.postgresql.org/). The nature of the data is very relational. There are different competitions, which have a new season every year. In each season, there are many fixtures, played in by teams, officiated by referees etc. I use PostgreSQL in my day job, so this was a natural choice for me.

## API

For this, I wanted to try something new, so I went with [Fastify](https://www.fastify.io/). I've heard good things about it, and this felt like a nice way to try it out. I work as a front end developer, so JS/TS are my bread and butter.

## Frontend

I'll be using [Vue 3](https://vuejs.org/) and [TypeScript](https://www.typescriptlang.org/) for the frontend.
