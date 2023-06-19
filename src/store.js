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
    setUser (action) {
      const store = this.store
      if (action.type === 'ADD_USER') this.store = { ...store, user: action.payload }
      if (action.type === 'DELETE_USER') this.store = { ...store, user: {} }
    }
  }
})