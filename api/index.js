import Fastify from 'fastify'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import autoLoad from '@fastify/autoload'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const logger = process.env.NODE_ENV === 'development' ? {
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
          },
  },
} : true

/**
 * @type {import('fastify').FastifyInstance} Instance of Fastify
 */
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

const start = async () => {
  try {
    const port = process.env.PORT | 8080
    const host = process.env.NODE_ENV === 'development' ? 'localhost' : '0.0.0.0'
    await fastify.listen({ port, host })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
