import { initializeI18n } from '../i18n'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

export default async ({ app }) => {
  // Initializes i18n
  initializeI18n(app)

  // Register global components
  app.component('Header', Header)
  app.component('Footer', Footer)
}