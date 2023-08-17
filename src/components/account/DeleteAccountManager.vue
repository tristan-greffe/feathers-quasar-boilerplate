<template>
  <div class="q-pa-md row justify-between items-center no-wrap bg-white">
    <span>{{ $t('DeleteAccountManager.QUESTION') }}</span>
    <q-btn 
      outline
      id="delete-account"
      color="negative"
      :label="$t('DELETE')"
      @click="onDelete"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Dialog, useQuasar } from 'quasar'
import { i18n } from '../../i18n'
import { api } from '../../boot/api'
import { useStore } from '../../boot/store'

// Data
const router = useRouter()
const $q = useQuasar()
const User = useStore().getUser

// Function
async function onDelete () {
  Dialog.create({
    title: i18n.t('DeleteAccountManager.CONFIRMATION_TITLE'),
    message: i18n.t('DeleteAccountManager.CONFIRMATION'),
    html: true,
    prompt: {
      model: '',
      type: 'text',
      isValid: val => val === User.email
    },
    persistent: true,
    ok: {
      label: i18n.t('OK'),
      flat: true
    },
    cancel: {
      label: i18n.t('CANCEL'),
      flat: true
    }
  }).onOk(async (data) => {
    try {
      await api.service('api/users').remove(User._id)
      useStore().setUser({})
      $q.notify({
        type: 'positive', 
        message: i18n.t('DeleteAccountManager.SUCCESS_MESSAGE')
      })
      router.push({ path: 'login' })
    } catch (error) {
      $q.notify({
        type: 'negative', 
        message: i18n.t('DeleteAccountManager.ERROR_MESSAGE')
      })
    }
  })
}
</script>
