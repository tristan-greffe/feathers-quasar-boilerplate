import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

export default async ({ app }) => {
  // Register global components
  app.component('Header', Header)
  app.component('Footer', Footer)
}