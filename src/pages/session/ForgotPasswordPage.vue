<template>
  <QSessionCard :shadow="50" :dense="true">
    <template v-slot:card-content>
      <div class="text-center q-pa-sm">
        <p class="text-h6">{{ $t('ForgotPassword.TITLE') }}</p>
        <p>{{ $t('ForgotPassword.MESSAGE') }}</p>
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
  </QSessionCard>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { i18n } from '../../i18n'
import { sendResetPassword } from '../../utils/utils.account'
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
    label: 'ForgotPassword.EMAIL_FIELD_LABEL',
    component: "QTextField"
  }
])

// Functions
async function onFieldChanged (field, value) {
  if (field === 'email') values.value.email = value
}
async function hasError () {
  // Check has email
  if (!_.has(values.value, 'email')) {
    $q.notify({ type: 'negative', message: i18n.t('ForgotPassword.MISSING_EMAIL') })
    return true
  }
  // Check email validity
  if (!/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(values.value.email)) {
    $q.notify({ type: 'negative', message: i18n.t('ForgotPassword.EMAIL_VALIDITY') })
    return true
  }
  return false
}
async function onSubmit () {
  if (!await hasError()) {
    try {
      loading.value = true
      await sendResetPassword(values.value.email)
      router.push({ path: 'reset-password' })
      loading.value = false
    } catch (error) {
      console.log(error)
      loading.value = false
      $q.notify({
        type: 'negative',
        message: i18n.t('ForgotPassword.ERROR_MESSAGE_DEFAULT')
      })
    }
  }
}
</script>
