<template>
  <div class="q-pa-md">
    <q-card class="q-py-sm no-shadow">
      <q-expansion-item
        v-if="!$store.getUser.isVerified"
        id="verify-email-manager"
        :label="$t('VerifyEmailManager.TITLE')"
        group="account"
        class="bg-grey-2"
        header-class= 'text-red'
        default-opened
      >
        <VerifyEmailManager />
      </q-expansion-item>
      <q-expansion-item
        id="change-email-manager"
        :label="$t('EmailManager.TITLE')"
        group="account"
        class="bg-grey-2"
      >
        <EmailManager />
      </q-expansion-item>
      <q-expansion-item
        id="change-password-manager"
        :label="$t('PasswordManager.TITLE')"
        group="account"
        class="bg-grey-2"
      >
        <PasswordManager />
      </q-expansion-item>
      <q-expansion-item
        id="delete-account-manager"
        :label="$t('DeleteAccountManager.TITLE')"
        group="account"
        class="bg-grey-2"
      >
        <DeleteAccountManager />
      </q-expansion-item>
    </q-card>
  </div>
</template>

<script setup>
import VerifyEmailManager from './VerifyEmailManager.vue'
import EmailManager from './EmailManager.vue'
import PasswordManager from './PasswordManager.vue'
import DeleteAccountManager from './DeleteAccountManager.vue'
</script>
