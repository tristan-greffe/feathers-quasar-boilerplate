const serverPort = process.env.PORT || 8081
const clientPort = process.env.CLIENT_PORT || 8080

let domain
// If we build a specific staging instance
if (process.env.NODE_APP_INSTANCE === 'dev') {
  // domain = 'https://feathers-quasar-boilerplate.dev.tristan-code.xyz'
  domain = 'http://localhost:' + serverPort
} else if (process.env.NODE_APP_INSTANCE === 'test') {
  domain = 'https://feathers-quasar-boilerplate.test.tristan-code.xyz'
} else if (process.env.NODE_APP_INSTANCE === 'prod') {
  domain = 'https://feathers-quasar-boilerplate.tristan-code.xyz'
} else {
  // Otherwise we are on a developer machine
  if (process.env.NODE_ENV === 'development') {
    domain = 'http://localhost:' + clientPort
  } else {
    domain = 'http://localhost:' + serverPort
  }
}

let origin
process.env.NODE_ENV === 'development' ? origin = 'http://localhost:' + serverPort : origin = domain

module.exports = {
  domain,
  origin,
  flavor: process.env.NODE_APP_INSTANCE || 'dev',
  version: require('../package.json').version,
  buildNumber: process.env.BUILD_NUMBER,
  apiPath: '/api',
  apiJwt: 'feathers-quasar-boilerplate-jwt',
  apiTimeout: 20000,
  transport: 'websocket', // Could be 'http' or 'websocket',
  appName: 'Feathers Quasar Boilerplate',
  appWebsite: 'https://github.com/tristan-greffe/feathers-quasar-boilerplate',
  publisher: 'Tristan Greffe',
  weatherApi: 'https://api.open-meteo.com/v1/forecast',
  geolocationApi: 'https://nominatim.openstreetmap.org/reverse',
  logs: {
    level: (process.env.NODE_ENV === 'development' ? 'debug' : 'info')
  },
  storage: {
    useProxy: true
  }
}