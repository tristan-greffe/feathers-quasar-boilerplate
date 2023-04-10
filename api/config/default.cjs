const serverPort = process.env.PORT || 8081
const domain = 'http://localhost:' + serverPort

module.exports = {
  host: process.env.HOSTNAME || 'localhost',
  port: serverPort,
  public: './public',
  origins: [
    domain
  ],
  paginate: {
    default: 10,
    max: 50
  },
  mongodb: 'mongodb://127.0.0.1:27017/feathers-quasar-boilerplate',
  authentication: {
    secret: process.env.APP_SECRET || 'my secret',
    service: 'users',
    entity: 'user',
    authStrategies: [
      'jwt',
      'local'
    ],
    local: {
      usernameField: 'email',
      passwordField: 'password'
    },
    jwtOptions: {
      header: {
        typ: 'access' // See https://tools.ietf.org/html/rfc7519#section-5.1
      },
      audience: domain,
      algorithm: 'HS256', // See https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
      expiresIn: '1d'
    },
    oauth: {
      google: {
        key: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_CLIENT_SECRET,
      },
    },
    defaultUsers: [
      {
        email: 'test@gmail.com',
        password: 'Pass;word1',
      }
    ],
  }
}