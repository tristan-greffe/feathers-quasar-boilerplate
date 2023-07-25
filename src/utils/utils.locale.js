import _ from 'lodash'
import { Quasar } from  'quasar'

export function getLocale () {
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