import { createI18n } from 'vue-i18n'
import { Quasar } from 'quasar'
import logger from 'loglevel'
import { getLocale } from '../utils/utils.locale'
import en from './app_en.json'
import fr from './app_fr.json'

export const i18n = {
  async initialize (app) {
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
    this.i18n = createI18n({
      locale,
      messages,
      globalInjection: true
    })
    app.use(this.i18n)
  },
  t (key, params) {
    if (!this.i18n) {
      logger.error('i18n instance is not existing. Did you initialize it ?')
      return key
    }
    return this.i18n.global.t(key, params)
  },
}