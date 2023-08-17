<template>
  <q-card class="q-pa-md">
    <!-- Form -->
    <q-card-section>
      <QForm 
        ref='modifyEmailFormRef'
        :values='modifyEmailValues'
        :fields='modifyEmailFields'
        @field-changed="onFieldChangedModifyEmail"
      />
    </q-card-section>
    <!-- Actions -->
    <q-card-actions align="right">
      <q-btn 
        id="modify-email"
        outline
        :loading="loading"
        color="primary" 
        :label="$t('APPLY')" 
        @click="request" 
      />
    </q-card-actions>
    <q-dialog v-model="dialog">
      <q-card>
        <!-- Form -->
        <q-card-section align="center">
          <QForm 
            ref='validateEmailFormRef'
            :values='validateEmailValues'
            :fields='validateEmailFields'
            @field-changed="onFieldChangedValidateEmail"
          />
        </q-card-section>
        <!-- Actions -->
        <q-card-actions align="center">
          <q-btn 
            id="validate-email"
            :loading="loading"
            color="primary" 
            :label="$t('APPLY')" 
            @click="applyChanges" 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { i18n } from '../../i18n'
import { sendChangeIdentity, verifySignup } from '../../utils/utils.account'
import { useStore } from '../../boot/store'
import QForm from '../../components/form/QForm.vue'

// Data
const $q = useQuasar()
const User = useStore().getUser
const loading = ref(false)
const dialog = ref(false)
const modifyEmailValues = ref({})
const modifyEmailFields = ref([
  {
    id: 'password',
    label: 'EmailManager.PASSWORD_FIELD_LABEL',
    component: 'QPasswordField',
    autocomplete: 'new-password'
  },
  {
    id: 'email',
    label: 'EmailManager.EMAIL_FIELD_LABEL',
    component: "QTextField"
  }
])
const validateEmailValues = ref({})
const validateEmailFields = ref([
  {
    id: 'token',
    label: 'EmailManager.TOKEN_LABEL',
    component: 'QTokenField',
    tokenLength: 6
  }
])


// Functions
async function onFieldChangedModifyEmail (field, value) {
  if (field === 'password') modifyEmailValues.value.password = value
  else if (field === 'email') modifyEmailValues.value.email = value
}
async function hasErrorModifyEmail () {
  // Check has password
  if (!_.has(modifyEmailValues.value, 'password')) {
    $q.notify({ type: 'negative', message: i18n.t('KEmailManager.MISSING_PASSWORD') })
    return true
  }
  // Check has email
  if (!_.has(modifyEmailValues.value, 'email')) {
    $q.notify({ type: 'negative', message: i18n.t('KEmailManager.MISSING_EMAIL') })
    return true
  }
  // Check email validity
  if (!/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(modifyEmailValues.value.email)) {
    $q.notify({ type: 'negative', message: i18n.t('KEmailManager.EMAIL_VALIDITY') })
    return true
  }
  return false
}
async function request () {
  if (await hasErrorModifyEmail()) return
  try {
    loading.value = true
    await sendChangeIdentity(User.email, modifyEmailValues.value.email, modifyEmailValues.value.password)
    dialog.value = true
    loading.value = false
  } catch (error) {
    if(error.data.translationKey) $q.notify({ type: 'negative',  message: i18n.t('Register.' + error.data.translationKey) })
    loading.value = false
  }
}
async function onFieldChangedValidateEmail (field, value) {
  if (field === 'token') validateEmailValues.value.token = value
}
async function hasErrorValidateEmail () {
  // Check has token
  if (!_.has(validateEmailValues.value, 'token' || validateEmailValues.value.token.length !== 6)) return true
  return false
}
async function applyChanges () {
  if (await hasErrorValidateEmail()) return
  try {
    loading.value = true
    await verifySignup(validateEmailValues.value.token, User.email)
    loading.value = false
    $q.notify({ type: 'positive', message: i18n.t('EmailManager.EMAIL_CHANGED') })
  } catch (error) {
    loading.value = false
    $q.notify({ type: 'negative', message: i18n.t('EmailManager.ERROR_MESSAGE') })
  }
  dialog.value = false
}
</script>
