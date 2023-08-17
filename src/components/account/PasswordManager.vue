<template>
  <q-card class="q-pa-md">
    <!-- Form -->
    <q-card-section>
      <QForm 
        ref='form'
        :values='values'
        :fields='fields'
        @field-changed="onFieldChanged"
      />
    </q-card-section>
    <!-- Actions -->
    <q-card-actions align="right">
      <q-btn 
        id="change-password"
        outline
        :loading="loading"
        color="primary" 
        :label="$t('APPLY')" 
        @click="apply" 
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { i18n } from '../../i18n'
import { changePassword } from '../../utils/utils.account'
import { useStore } from '../../boot/store'
import QForm from '../../components/form/QForm.vue'


// Data
const $q = useQuasar()
const User = useStore().getUser
const loading = ref(false)
const values = ref({})
const fields = ref([
  {
    id: 'oldPassword',
    label: 'PasswordManager.OLD_PASSWORD_FIELD_LABEL',
    component: 'QPasswordField',
    autocomplete: 'new-password'
  },
  {
    id: 'newPassword',
    label: 'PasswordManager.PASSWORD_FIELD_LABEL',
    component: 'QPasswordField',
    autocomplete: 'new-password'
  },
  {
    id: 'passwordConfirmation',
    label: 'PasswordManager.CONFIRM_PASSWORD_FIELD_LABEL',
    component: 'QPasswordField',
    autocomplete: 'new-password'
  },
])

// Functions
async function onFieldChanged (field, value) {
  if (field === 'oldPassword') values.value.oldPassword = value
  else if (field === 'newPassword') values.value.password = value
  else if (field === 'passwordConfirmation') values.value.passwordConfirmation = value
}
async function hasError () {
  // Check has old password
  if (!_.has(values.value, 'oldPassword')) {
    $q.notify({ type: 'negative', message: i18n.t('PasswordManager.MISSING_OLD_PASSWORD') })
    return true
  }
  // Check has password
  if (!_.has(values.value, 'password')) {
    $q.notify({ type: 'negative', message: i18n.t('PasswordManager.MISSING_PASSWORD') })
    return true
  }
  // Check has password confirmation
  if (!_.has(values.value, 'passwordConfirmation')) {
    $q.notify({ type: 'negative', message: i18n.t('PasswordManager.MISSING_PASSWORD_CONFIRMATION') })
    return true
  }
  // Check password match
  if (values.value.password !== values.value.passwordConfirmation) {
    $q.notify({ type: 'negative', message: i18n.t('PasswordManager.PASSWORD_CONFIRMATION_NOT_MATCH') })
    return true
  }
  return false
}
async function apply () {
  if (await hasError()) return
  try {
    loading.value = true
    await changePassword(User.email, values.value.oldPassword, values.value.password)
    loading.value = false
    $q.notify({
      type: 'positive',
      message: i18n.t('PasswordManager.PASSWORD_CHANGED')
    })
  } catch (error) {
    console.log(error)
    loading.value = false
    $q.notify({
      type: 'negative',
      message: error.data.translationKey ? i18n.t('Register.' + error.data.translationKey) : i18n.t('PasswordManager.PASSWORD_ERROR_MESSAGE') 
    })
  }
}
</script>
