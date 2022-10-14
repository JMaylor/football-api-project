import fastifyPlugin from 'fastify-plugin'

export default fastifyPlugin(async (fastify, options) => {
  fastify.register(import('@fastify/postgres'), {
    connectionString: process.env.DATABASE_URL,
    ssl: {
    rejectUnauthorized: true,
    ca:
      process.env.NODE_ENV === PRODUCTION
        ? process.env.CA_CERT
        : fs.readFileSync("ca_cert.crt").toString(),
    },
  })
})
