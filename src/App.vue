<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import _ from 'lodash'
import logger from 'loglevel'
import { computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar, Loading } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from './boot/api'
import { i18n } from './i18n'
import { useStore } from './boot/store'
import { restoreSession } from './utils/utils.session.js'

// Data
const $q = useQuasar()
let pendingReconnection = null
const router = useRouter()

// Computed
const user = computed(() => useStore().getUser)

// Functions
function redirect () {
  // Guard unauthenticated users
  if (_.isEmpty(user.value)) router.push({ path: '/login'})
  if (!_.isEmpty(user.value)) router.push({ path: '/'})
}
function onReconnectError () {
  // Display it only the first time the error appears because multiple attempts will be tried
  if (!pendingReconnection) {
    logger.error(new Error('Socket has been disconnected'))
    // This will ensure any operation in progress will not keep a "dead" loading indicator
    // as this error might appear under-the-hood without notifying service operations
    Loading.hide()
    pendingReconnection = $q.dialog({
      title: i18n.t('Session.ALERT'),
      message: i18n.t('Session.DISCONNECT'),
      html: true,
      persistent: true
    }).onDismiss(() => { pendingReconnection = null })
  }
}
function onReconnect () {
  // Dismiss pending reconnection error message
  if (pendingReconnection) {
    pendingReconnection.hide()
  }
  logger.error(new Error('Socket disconnected, not trying to reconnect automatically in development mode please refresh page manually'))
}
function onRateLimit () {
  $q.dialog({
    title: i18n.t('Session.ALERT'),
    message: i18n.t('Session.REFUSED'),
    html: true,
    ok: {
      label: i18n.t('Session.RETRY'),
      flat: true
    }
  }).onOk(() => window.location.reload())
}

// Watch
watch(user, async () => {
  await redirect()
}, { deep: true })

// Hooks
onMounted(async () => {
  // Handle socket connexion
  if (api.socket) {
    // Display error message if we cannot contact the server
    api.socket.io.on('reconnect_error', onReconnectError)
    // Handle reconnection correctly, otherwise auth seems to be lost
    // Also easier to perform a full refresh instead of handling this specifically on each activity
    api.socket.io.on('reconnect', onReconnect)
    // Display error message if we have been banned from the server
    api.socket.on('rate-limit', onRateLimit)
  }
  await restoreSession()
})

onBeforeUnmount(() => {
  if (api.socket) {
    api.socket.off('reconnect_error', onReconnectError)
    api.socket.off('reconnect', onReconnect)
    api.socket.off('rate-limit', onRateLimit)
  }
})

// Immediate
// Guard unauthenticated users
router.beforeEach((to, from, next) => {
  if (to.path === '/' && _.isEmpty(user.value)) next({ path: '/login' })
  next()
})
</script>
