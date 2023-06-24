import { Quasar } from  'quasar'
import { createI18n } from 'vue-i18n'
import logger from 'loglevel'
import _ from 'lodash'
import en from './app_en.json'
import fr from './app_fr.json'

function getLocale () {
  const locale =
    navigator.language ||
    navigator.languages[0] ||
    navigator.browserLanguage ||
    navigator.userLanguage ||
    navigator.systemLanguage

  if (locale) {
    // see https://www.ietf.org/rfc/bcp/bcp47.txt
    const languageCodes = _.split(locale, '-')
    if (languageCodes.length > 0 && _.first(languageCodes) === 'fr') return 'fr'
  }
  return Quasar.lang.isoName
}

export async function initializeI18n (app) {
  // Define the locale to be used
  const locale = getLocale()
  // Define messages
  const messages = {
    'en-US': en,
    'fr': fr
  }
  // Install Quasar langage pack
  try {
    const langagePack = await import(`quasar/lang/${locale}.js`)
    if (langagePack) Quasar.lang.set(langagePack.default)
  } catch (error) {
    logger.error(error)
  }
  // Create i18n instance
  const i18n = createI18n({
    locale,
    messages,
    globalInjection: true
  })
  app.use(i18n)
}