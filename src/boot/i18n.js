import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
import _ from 'lodash'
import { Quasar } from  'quasar'

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
    if (languageCodes.length > 0) return languageCodes[0]
  }
  // return undefined by default
}


export default boot(({ app }) => {
  console.log(Quasar)
  const i18n = createI18n({
    locale: getLocale() == 'fr' ? 'fr-FR' : Quasar.lang.isoName,
    globalInjection: true,
    messages
  })

  // Set i18n instance on app
  app.use(i18n)
})
