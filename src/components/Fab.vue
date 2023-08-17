<template>
  <q-page-sticky position="bottom-right" class="z-top" :offset="[ 18, 18 ]">
    <!--
      Fab section
    -->
    <q-fab
      id="fab"
      icon="fa-solid fa-ellipsis-vertical"
      direction="up"
      color="primary"
      :disable="draggingFab"
      v-touch-pan.prevent.mouse="moveFab"
    >
      <q-fab-action @click="logout" color="primary" icon="las la-sign-out-alt" :disable="draggingFab" >
        <q-tooltip class="bg-accent">{{ $t('Tooltip.LOGOUT') }}</q-tooltip>
      </q-fab-action> 
      <q-fab-action @click="showModal = !showModal" color="primary" icon="las la-cog" :disable="draggingFab" >
        <q-tooltip class="bg-accent">{{ $t('Tooltip.MANAGE_ACCOUNT') }}</q-tooltip>
      </q-fab-action> 
    </q-fab>
  </q-page-sticky>
  <q-dialog persistent v-model="showModal">
    <q-card id="modal-card" style="width: 90vh">
      <!--
        Content section
      -->
      <div id="modal-content" class="col">
        <AccountManager />
      </div>
      <!--
        Footer section
      -->
      <div id="modal-footer" class="q-pa-sm row full-width justify-end">
        <q-card-actions align="right">
          <q-btn :label="$t('CLOSE')" color="primary" v-close-popup />
        </q-card-actions>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { logout } from '../utils/utils.session'
import AccountManager from './account/AccountManager.vue'

// Data
const draggingFab = ref(false)
const showModal = ref(false)

// Functions
function moveFab (event) {
  draggingFab.value = event.isFirst !== true && event.isFinal !== true
}
</script>
