import fastifyPlugin from 'fastify-plugin'
import * as fs from 'fs';

export default fastifyPlugin(async (fastify, options) => {
  fastify.register(import('@fastify/postgres'), {
    connectionString: process.env.DATABASE_URL,
    ssl: {
    rejectUnauthorized: true,
    ca:
      process.env.NODE_ENV === 'production'
        ? process.env.CA_CERT
        : fs.readFileSync("ca_cert.crt").toString(),
    },
  })
})
