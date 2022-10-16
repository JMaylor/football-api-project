# Plugins

[Fastify](https://www.fastify.io/) has some great docs on [getting started](https://www.fastify.io/docs/latest/Guides/Getting-Started/) with a simple app. This isn't going to be a Fastify tutorial, as everything I've done came straight from their docs. Instead I'll be going through the plugins I used.

## Autoload

[@fastify/autoload](https://github.com/fastify/fastify-autoload) is a plugin that automatically loads both API routes, and other plugins, from directories that you specify in your app. By setting this up, it allows you to simply add a file in a configured folder, and that route or plugin will be automatically used by your Fastify instance. In short, a basic Fastify setup would look like this:

```js
import Fastify from 'fastify'
import autoLoad from '@fastify/autoload'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const fastify = Fastify({
  logger,
})

// autoload plugins
fastify.register(autoLoad, {
  dir: join(__dirname, 'plugins')
})

// autoload routes
fastify.register(autoLoad, {
  dir: join(__dirname, 'routes')
})
```

This means that anything in the `plugins` and `routes` directories will be automatically registered by the fastify instance. The automatically loaded files can be seen below. This is how I'll structure the plugins and routes in this project.

```
├── plugins
│   ├── myPlugin.js
│   └── another-plugin.js
├── routes
│   ├── someRouteType
│   │   └── index.js
│   ├── someOtherRouteType
│   │   └── typescript.ts
├── package.json
└── app.js
```

## Postgres

[@fastify/postgres](https://github.com/fastify/fastify-postgres) is a plugin which wraps [node-postgres](https://node-postgres.com/) to connect to a Postgres database. Obviously this will be useful in this project, since the data sits inside a Postgres database.

## Rate Limit

Since I'll be making the API public for others to consume, it makes sense to try and protect it from any DDOS attacks or anything like that. For this, the [@fastify/rate-limit](https://github.com/fastify/fastify-rate-limit) plugin will help, by limiting the number of requests accepted by any single IP address.

## Caching

The [@fastify/caching](https://github.com/fastify/fastify-caching) will be used for two types of caching:
1. Manipulating cache headers so that client-side browsers know to use cached data, rather than fetching unchanged data from the server each time.
2. Caching data server-side, so that the database doesn't need to be queried each time the same endpoint is hit. Since the data is historic, it won't be changing any time soon.