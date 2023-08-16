import _ from 'lodash'
import { i18n } from '../i18n'

export default async ({ app }) => {
  // Initializes i18n
  await i18n.initialize(app)

  // Register store propertie to the the vue app
  app.config.globalProperties.$t = i18n
}
