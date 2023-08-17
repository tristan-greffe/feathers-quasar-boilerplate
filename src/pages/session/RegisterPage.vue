<template>
  <QSessionCard :footer="true" :shadow="50" :dense="true">
    <template v-slot:card-content>
      <QForm 
        ref='form'
        :values='values'
        :fields='fields'
        @field-changed="onFieldChanged"
      />
    </template>
    <template v-slot:card-action>
      <q-btn :loading="loading" color="primary" :label="$t('Register.REGISTER_LABEL')" @click="onSubmit" id="register-button" />
    </template>
    <template v-slot:card-footer>
      <div class="row items-center q-pa-none justify-center" direction="horizontal" id="frame-actions">
        <q-btn rounded flat size="12px" :label="$t('Register.ALREADY_HAVE_AN_ACCOUNT_LABEL')" class="text-grey-9" id="register-link" @click="router.replace({ path: '/login' })" />
      </div>
    </template>
  </QSessionCard>
</template>

<script setup>
import _ from 'lodash'
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { i18n } from '../../i18n'
import { register } from '../../utils/utils.session'
import QForm from '../../components/form/QForm.vue'
import QSessionCard from '../../components/QSessionCard.vue'

// Data
const router = useRouter()
const $q = useQuasar()
const loading = ref(false)
const values = ref({})
const fields = ref([
  {
    id: 'username',
    label: 'Register.NAME_FIELD_LABEL',
    component: 'QTextField',
    autocomplete: 'username'
  },
  {
    id: 'email',
    label: 'Register.EMAIL_FIELD_LABEL',
    component: 'QTextField'
  },
  {
    id: 'password',
    label: 'Register.PASSWORD_FIELD_LABEL',
    component: 'QPasswordField',
    autocomplete: 'new-password'
  },
  {
    id: 'passwordConfirmation',
    label: 'Register.CONFIRM_PASSWORD_FIELD_LABEL',
    component: 'QPasswordField',
    autocomplete: 'new-password'
  }
])

// Functions
async function onFieldChanged (field, value) {
  if (field === 'username') values.value.username = value
  else if (field === 'email') values.value.email = value
  else if (field === 'password') values.value.password = value
  else if (field === 'passwordConfirmation') values.value.passwordConfirmation = value
}
async function hasError () {
  // Check has name
  if (!_.has(values.value, 'username')) {
    $q.notify({ type: 'negative', message: i18n.t('Register.MISSING_NAME') })
    return true
  }
  // Check has email
  if (!_.has(values.value, 'email')) {
    $q.notify({ type: 'negative', message: i18n.t('Register.MISSING_EMAIL') })
    return true
  }
  // Check has password
  if (!_.has(values.value, 'password')) {
    $q.notify({ type: 'negative', message: i18n.t('Register.MISSING_PASSWORD') })
    return true
  }
  // Check has password confirmation
  if (!_.has(values.value, 'passwordConfirmation')) {
    $q.notify({ type: 'negative', message: i18n.t('Register.MISSING_PASSWORD_CONFIRMATION') })
    return true
  }
  // Check password match
  if (values.value.password !== values.value.passwordConfirmation) {
    $q.notify({ type: 'negative', message: i18n.t('Register.PASSWORD_CONFIRMATION_NOT_MATCH') })
    return true
  }
  // Check email validity
  if (!/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(values.value.email)) {
    $q.notify({ type: 'negative', message: i18n.t('Register.EMAIL_VALIDITY') })
    return true
  }
  return false
}
async function onSubmit () {
  if (!await hasError()) {
    try {
      loading.value = true
      await register(values.value)
      loading.value = false
    } catch (error) {
      loading.value = false
    }

  }
}
</script>
