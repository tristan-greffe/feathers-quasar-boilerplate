import _ from 'lodash'
import makeDebug from 'debug'
import puppeteer from 'puppeteer'

const debug = makeDebug('test:runner')

export class Runner {
  constructor () {
    this.warnings = []
    this.errors = []
    // Compute helper default options
    const defaultPort = process.env.CLIENT_PORT || '8080'
    let domain = `http://localhost:${defaultPort}`
    const defaultBrowser = process.env.BROWSER || 'chrome'
    // Set the runner options using default and overriden options
    this.options = {
      baseUrl: domain,
      browser: {
        product: defaultBrowser,
        headless: process.env.HEADLESS ? !!process.env.HEADLESS : false,
        devtools: (process.env.NODE_ENV === 'development'),
        defaultViewport: {
          width: +process.env.VIEWPORT_WIDTH || 1024,
          height: +process.env.VIEWPORT_HEIGHT || 768
        },
        args: process.env.BROWSER_ARGS ? _.split(process.env.BROWSER_ARGS, ' ') : []
      },
    }
    // Display the runner options
    console.log('Runner created with the following options:')
    console.log(this.options)
  }

  getUrl (path) {
    return path ? this.options.baseUrl + '/#/' + path : this.options.baseUrl
  }

  async start (path) {
    this.browser = await puppeteer.launch(this.options.browser)
    this.page = await this.browser.newPage()
    // Handle geolocation if needed
    if (_.has(this.options, 'geolocation.latitude') && _.has(this.options, 'geolocation.longitude')) {
      const context = this.browser.defaultBrowserContext()
      await context.overridePermissions(this.getUrl(path), ['geolocation'])
      await this.page.setGeolocation(this.options.geolocation)
    }
    // Handle the local storage if needed
    if (this.options.localStorage) {
      await this.page.evaluateOnNewDocument(items => {
        for (const [key, value] of Object.entries(items)) localStorage.setItem(key, value)
      }, this.options.localStorage)
    }
    // Catch errors
    this.page.on('console', message => {
      if (message._type === 'error') {
        this.errors.push(message)
        debug('Console error:', message)
      }
      if (message._type === 'warning') {
        this.warnings.push(message)
        // debug('Console warning:', message)
      }
    })
    // Navigate the to given url
    await this.page.goto(this.getUrl(path))
    return this.page
  }

  async stop () {
    // Ensure it has been correctly initialized
    if (this.browser) await this.browser.close()
  }

  hasError () {
    return this.errors.length > 0
  }

  getErrors () {
    return this.errors
  }

  clearErrors () {
    this.errors = []
  }

  hasWarning () {
    return this.warnings.length > 0
  }

  getWarnings () {
    return this.warnings
  }

  clearWarnings () {
    this.warnings = []
  }
}
