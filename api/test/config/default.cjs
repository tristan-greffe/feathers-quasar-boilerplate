var path = require('path')
var fs = require('fs')
// var containerized = require('containerized')()

const serverPort = process.env.PORT || 8081
const API_PREFIX = '/api'

module.exports = {
  apiPath: API_PREFIX,
  paginate: { default: 10, max: 50 },
  mongodb: 'mongodb://127.0.0.1:27017/feathers-quasar-boilerplate',
  host: process.env.HOSTNAME || 'localhost',
  port: serverPort,
  distPath: fs.existsSync(path.join(__dirname, '../../dist/pwa')) ? path.join(__dirname, '../../dist/pwa') : path.join(__dirname, '../../dist/spa'),
  passwordPolicy: {
    minLength: 8,
    maxLength: 128,
    uppercase: true,
    lowercase: true,
    digits: true,
    symbols: true,
    prohibited: fs.readFileSync(path.join(__dirname, '10k_most_common_passwords.txt')).toString().split('\n')
  },
  mailer: {
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASWORD
    },
    templateDir: path.join(__dirname, 'email-templates')
  },
  proxyTable: {},
  public: './public',
  authentication: {
    secret: process.env.APP_SECRET || 'my secret',
    service: API_PREFIX + '/users',
    path: API_PREFIX + '/authentication',
    entity: 'user',
    authStrategies: [
      'jwt',
      'local',
      'google'
    ],
    local: {
      usernameField: 'email',
      passwordField: 'password'
    },
    jwtOptions: {
      header: {
        typ: 'access' // See https://tools.ietf.org/html/rfc7519#section-5.1
      },
      audience: 'https://tristan-code.xyz',
      algorithm: 'HS256', // See https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
      expiresIn: '1d'
    },
    oauth: {
      google: {
        key: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_CLIENT_SECRET,
      },
    }
  }
}