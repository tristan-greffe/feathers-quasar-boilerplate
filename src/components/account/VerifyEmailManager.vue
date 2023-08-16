<template>
  <!-- Helper -->
  <q-expansion-item icon="las la-question" :label="$t('VerifyEmailManager.HELP_LABEL')">
    <div class="q-pa-md">
      <i18n-t class="text-body2" keypath="VerifyEmailManager.HELP_TEXT" tag="p" scope="global" />
    </div>
  </q-expansion-item>
  <q-expansion-item icon="las la-question" :label="$t('VerifyEmailManager.HELP_EMAIL_LABEL')">
    <div class="q-pa-md">
      <i18n-t class="text-body2" keypath="VerifyEmailManager.HELP_EMAIL_TEXT" tag="p" scope="global">
        <template v-slot:email>
          <span class="text-weight-bold">boilerplate.js@gmail.com</span>
        </template>
      </i18n-t>
    </div>
  </q-expansion-item>
  <q-card>
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
    <q-card-actions align="center">
      <q-btn 
        id="verify-email"
        :loading="loading" 
        color="primary" 
        :label="$t('APPLY')" 
        @click="apply" 
      />
      <q-btn 
        id="resend-verify-signup"
        outline
        color="primary" 
        :label="$t('VerifyEmailManager.ACTION')" 
        @click="resendToken" 
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { i18n } from '../../i18n'
import { verifySignup, resendVerifySignup } from '../../utils/utils.account'
import { useStore } from '../../boot/store'
import QForm from '../../components/form/QForm.vue'

// Data
const $q = useQuasar()
const User = useStore().getUser
const loading = ref(false)
const values = ref({})
const fields = ref([
  {
    id: 'token',
    label: 'VerifyEmailManager.TOKEN_LABEL',
    component: 'QTokenField',
    tokenLength: 6
  }
])

// Functions
async function onFieldChanged (field, value) {
  if (field === 'token') values.value.token = value
}
async function hasError () {
  // Check has token
  if (!_.has(values.value, 'token' || values.value.token.length !== 6)) return true
  return false
}
async function apply () {
  if (await hasError()) return
  try {
    loading.value = true
    await verifySignup(values.value.token, User.email)
    loading.value = false
    User.isVerified = true
    useStore().setUser(User)
    $q.notify({
      type: 'positive',
      message: i18n.t('VerifyEmailManager.EMAIL_VERIFIED')
    })
  } catch (error) {
    loading.value = false
    $q.notify({
      type: 'negative',
      message: i18n.t('VerifyEmailManager.ERROR_MESSAGE')
    })
  }
}
async function resendToken () {
  try {
    await resendVerifySignup(User.email)
    $q.notify({
      type: 'positive',
      message: i18n.t('VerifyEmailManager.RESEND_TOKEN_SUCCESS')
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: i18n.t('VerifyEmailManager.RESEND_TOKEN_ERROR')
    })
  }
}
</script>