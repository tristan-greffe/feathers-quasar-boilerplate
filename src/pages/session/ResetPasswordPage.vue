<template>
  <QSessionCard :footer="true" :shadow="50" :dense="true">
    <template v-slot:card-content>
      <div class="text-center q-pa-sm">
        <p class="text-h6">{{ $t('ResetPassword.TITLE') }}</p>
        <p>{{ $t('ResetPassword.MESSAGE') }}</p>
      </div>
      <QForm 
        ref='form'
        :values='values'
        :fields='fields'
        @field-changed="onFieldChanged"
      />
    </template>
    <template v-slot:card-action>
      <q-btn :loading="loading" color="primary" :label="$t('APPLY')" @click="onSubmit" />
    </template>
    <template v-slot:card-footer>
      <div class="row items-center q-pa-none justify-center" direction="horizontal" id="frame-actions">
        <q-btn rounded flat size="12px" :label="$t('ResetPassword.RESEND_TOKEN')" class="text-grey-9" id="resend-token" @click="router.replace({ path: '/forgot-password' })" />
      </div>
    </template>
  </QSessionCard>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { i18n } from '../../i18n'
import { resetPassword } from '../../utils/utils.account'
import QForm from '../../components/form/QForm.vue'
import QSessionCard from '../../components/QSessionCard.vue'

// Data
const $q = useQuasar()
const router = useRouter()
const loading = ref(false)
const values = ref({})
const fields = ref([
  {
    id: 'email',
    label: 'ResetPassword.EMAIL_FIELD_LABEL',
    component: 'QTextField'
  },
  {
    id: 'password',
    label: 'ResetPassword.PASSWORD_FIELD_LABEL',
    component: 'QPasswordField',
    autocomplete: 'new-password'
  },
  {
    id: 'passwordConfirmation',
    label: 'ResetPassword.CONFIRM_PASSWORD_FIELD_LABEL',
    component: 'QPasswordField',
    autocomplete: 'new-password'
  },
  {
    id: 'token',
    label: 'ResetPassword.TOKEN_FIELD_LABEL',
    component: 'QTokenField',
    tokenLength: 6
  }
])

// Functions
async function onFieldChanged (field, value) {
  if (field === 'email') values.value.email = value
  else if (field === 'password') values.value.password = value
  else if (field === 'passwordConfirmation') values.value.passwordConfirmation = value
  else if (field === 'token') values.value.token = value
}
async function hasError () {
  // Check has email
  if (!_.has(values.value, 'email')) {
    $q.notify({ type: 'negative', message: i18n.t('ResetPassword.MISSING_EMAIL') })
    return true
  }
  // Check has password
  if (!_.has(values.value, 'password')) {
    $q.notify({ type: 'negative', message: i18n.t('ResetPassword.MISSING_PASSWORD') })
    return true
  }
  // Check has password confirmation
  if (!_.has(values.value, 'passwordConfirmation')) {
    $q.notify({ type: 'negative', message: i18n.t('ResetPassword.MISSING_PASSWORD_CONFIRMATION') })
    return true
  }
  // Check has token
  if (!_.has(values.value, 'token')) {
    $q.notify({ type: 'negative', message: i18n.t('ResetPassword.MISSING_TOKEN') })
    return true
  }
  // Check password match
  if (values.value.password !== values.value.passwordConfirmation) {
    $q.notify({ type: 'negative', message: i18n.t('ResetPassword.PASSWORD_CONFIRMATION_NOT_MATCH') })
    return true
  }
  // Check email validity
  if (!/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(values.value.email)) {
    $q.notify({ type: 'negative', message: i18n.t('ResetPassword.EMAIL_VALIDITY') })
    return true
  }
  // Check token length
  if (values.value.token.length !== 6) {
    $q.notify({ type: 'negative', message: i18n.t('ResetPassword.ERROR_TOKEN_LENGTH') })
    return true
  }
  return false
}
async function onSubmit () {
  if (!await hasError()) {
    try {
      loading.value = true
      await resetPassword(values.value.email, values.value.token, values.value.password)
      loading.value = false
      $q.notify({ type: 'positive', message: i18n.t('ResetPassword.SUCCESS_MESSAGE') })
      router.push({ path: 'login' })
    } catch (error) {
      loading.value = false
      $q.notify({
        type: 'negative',
        message: i18n.t('ResetPassword.ERROR_MESSAGE')
      })
      router.push({ path: 'forgot-password' })
    }
  }
}
</script>
