<template>
  <q-drawer id="left-sidebar" show-if-above side="left" behavior="desktop" :width="90" class="primaryBackground">
    <q-list class="flex flex-center column q-mt-sm q-mb-md">
      <q-item clickable @click="emit('setMenuItem', 'weather')">
        <q-item-section avatar class="flex flex-center column">
          <q-icon name="fas fa-cloud" :style="{color:selectedMenuItem === 'weather' ? '#adf8a6' : ''}" />
        </q-item-section>
      </q-item>
      <q-item clickable @click="emit('setMenuItem', 'support')">
        <q-item-section avatar class="flex flex-center column">
          <q-icon name="fas fa-comments" :style="{color:selectedMenuItem === 'support' ? '#adf8a6' : ''}" />
        </q-item-section>
      </q-item>
      <q-item clickable @click="emit('setMenuItem', 'settings')">
        <q-item-section avatar class="flex flex-center column">
          <q-icon name="fas fa-cog" :style="{color:selectedMenuItem === 'settings' ? '#adf8a6' : ''}" />
        </q-item-section>
      </q-item>
      <q-item clickable @click="logout">
        <q-item-section avatar class="flex flex-center column">
          <q-icon name="fas fa-sign-out-alt" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup>
import { logout } from '../api/session'

// Props
const props = defineProps(['selectedMenuItem'])

// Emits
const emit = defineEmits(['setMenuItem'])
</script>
