// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import express, {
  rest,
  cors,
  notFound,
  errorHandler
} from '@feathersjs/express'
import configuration from '@feathersjs/configuration'
import socketio from '@feathersjs/socketio'
import _ from 'lodash'
import { logger } from './logger.js'
import { mongodb } from './mongodb.js'
import { authentication } from './authentication.js'
import history from 'connect-history-api-fallback'
import { services } from './services/index.js'
import { channels } from './channels.js'

export async function runApplication () {
  const app = express(feathers())
  // By default EventEmitters will print a warning if more than 10 listeners are added for a particular event.
  // The value can be set to Infinity (or 0) to indicate an unlimited number of listeners.
  app.setMaxListeners(0)
  // Load app configuration first
  app.configure(configuration())
  // Enable CORS, security, and body parsing
  app.use(cors())
  const bodyParserConfig = app.get('bodyParser')
  app.use(express.json(_.get(bodyParserConfig, 'json')))
  app.use(express.urlencoded({ extended: true }))
  app.use(history())
  
  // Set up plugins and providers
  app.configure(rest())
  app.configure(
    socketio({
      cors: {
        origin: app.get('origins')
      }
    })
  )
  app.configure(authentication)
  // Connect to DB
  await mongodb(app)
  // Set services (see `services/index.js`)
  app.configure(services)
  // Set up real-time event channels
  app.configure(channels)
  // Serve pure static assets
  if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(app.get('distPath')))
  }
  // Configure a middleware for 404s and the error handler
  app.use(notFound())
  app.use(errorHandler({ logger }))
  // Register hooks
  app.hooks({
    around: {
      all: []
    },
    before: {},
    after: {},
    error: {
      all: []
    }
  })
  // Register setup and teardown hooks
  app.hooks({
    setup: [],
    teardown: []
  })

  // Run server
  const port = app.get('port')
  process.on('unhandledRejection', (reason, p) =>
    logger.error('Unhandled Rejection at: Promise ', reason)
  )
  logger.info(`Configuring HTTP server with at port ${port}`)
  await app.listen(port)
  logger.info('Server started listening')

  return app
}
