import Fastify from 'fastify'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import autoLoad from '@fastify/autoload'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * @type {import('fastify').FastifyInstance} Instance of Fastify
 */
const fastify = Fastify({
  logger: true
})

// autoload plugins
fastify.register(autoLoad, {
  dir: join(__dirname, 'plugins')
})

// autoload routes
fastify.register(autoLoad, {
  dir: join(__dirname, 'routes')
})

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT | 8080 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
