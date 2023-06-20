import { createPinia, defineStore } from 'pinia'

export function initializeStore(app) {
  const pinia = createPinia()
  app.use(pinia)
}

export const useStore = defineStore('store', {
  state: () => ({
    store: { user: {} }
  }),
  actions: {
    setUser (user) {
      this.store = { ...store, user: user }
    }
  }
})