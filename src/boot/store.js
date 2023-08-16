import { createPinia, defineStore } from 'pinia'

function initializeStore(app) {
  const pinia = createPinia()
  app.use(pinia)
}

export const useStore = defineStore('store', {
  state: () => ({ user: {}, time: {} }),
  getters: {
    getUser: (state) => state.user,
    getTime: (state) => state.time
  },
  actions: {
    setUser (user) {
      this.user = user
    },
    setTime (time) {
      this.time = time
    }
  }
})

export default async ({ app }) => {
  // Initializes store
  initializeStore(app)

  // Register store propertie to the the vue app
  app.config.globalProperties.$store = useStore()

  // Register global propertie
  // FIXME: This is used for testing purpose
  global.$store = app.config.globalProperties.$store
}
