import { createPinia, defineStore } from 'pinia'

export function initializeStore(app) {
  const pinia = createPinia()
  app.use(pinia)
}

export const useStore = defineStore('store', {
  state: () => ({ user: {} }),
  getters: {
    getUser: (state) => state.user
  },
  actions: {
    setUser (user) {
      this.user = user
    }
  }
})