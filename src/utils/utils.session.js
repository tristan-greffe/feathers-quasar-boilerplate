import { Notify } from 'quasar'
import { getLocale } from './utils.locale'
import { i18n } from '../i18n'
import { useStore } from '../boot/store'
import { api } from '../boot/api'
import _ from 'lodash'

export async function login (email, password) {
  const payload = {
    strategy: 'local',
    email: email,
    password: password
  }
  const response = await api.authenticate(payload)
  api.authentication.setAccessToken(response.accessToken)
  useStore().setUser(response.user)
}

export async function register (user) {
  delete user.passwordConfirmation
  delete user.acceptLicense
  user.locale = getLocale()

  try {
    await api.service('api/users').create(user)
  } catch (error) {
    Notify.create({
      type: 'negative', 
      message: error.data.translationKey ? i18n.t('Register.' + error.data.translationKey) : i18n.t('Register.REGISTER_ERROR') 
    })
  }
  await login(user.email, user.password)
}

export async function logout () {
  await api.logout()
  await api.authentication.removeAccessToken()
  useStore().setUser({})
}

export async function restoreSession () {
  try {
    const response = await api.reAuthenticate()
    const user = response.user ? response.user : {}
    useStore().setUser(user)
  } catch (error) {
    await logout()
  }
}
