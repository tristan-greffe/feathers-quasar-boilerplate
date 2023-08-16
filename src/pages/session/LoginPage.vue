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
      <q-btn :loading="loading" color="primary" :label="$t('Login.LOGIN_LABEL')" @click="onSubmit" />
    </template>
    <template v-slot:card-footer>
      <div class="row items-center q-pa-none justify-center" direction="horizontal" id="frame-actions">
        <q-btn rounded flat size="12px" :label="$t('Login.FORGOT_YOUR_PASSWORD_LABEL')" class="text-grey-9" id="reset-password-link" @click="router.replace({ path: '/forgot-password' })" />
        <q-btn rounded flat size="12px" :label="$t('Login.DONT_HAVE_AN_ACCOUNT_LABEL')" class="text-grey-9" id="register-link" @click="router.replace({ path: '/register' })" />
      </div>
    </template>
  </QSessionCard>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { i18n } from '../../i18n'
import { login } from '../../utils/utils.session'
import QForm from '../../components/form/QForm.vue'
import QSessionCard from '../../components/QSessionCard.vue'

// Data
const router = useRouter()
const $q = useQuasar()
const loading = ref(false)
const values = ref({})
const fields = ref([
  {
    id: 'email',
    label: 'Login.EMAIL_FIELD_LABEL',
    component: "QTextField"
  },
  {
    id: 'password',
    label: 'Login.PASSWORD_FIELD_LABEL',
    component: "QPasswordField",
    autocomplete: 'current-password'
  },
])

// Functions
async function onFieldChanged (field, value) {
  if (field === 'email') values.value.email = value
  else if (field === 'password') values.value.password = value
}
async function onSubmit () {
  try {
    loading.value = true
    await login(values.value.email, values.value.password)
    loading.value = false
  } catch (error) {
    loading.value = false
    $q.notify({
      type: 'negative', 
      message: i18n.t('Login.LOGIN_ERROR')
    })
  }
}
</script>
