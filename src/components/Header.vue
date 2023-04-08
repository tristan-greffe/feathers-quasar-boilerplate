<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
      />
      <q-toolbar-title>
        {{ $t('navbar.TITLE_LABEL') }}
      </q-toolbar-title>
      <div>Quasar v{{ $q.version }}</div>
    </q-toolbar>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
        </q-item-label>
        <div class="row justify-center">
          <q-btn outline color="primary" disable :label="$t('navbar.LOGIN_LABEL')" />
        </div>
        <div class="row justify-center">
          <q-btn class="glossy q-mt-md" color="primary" disable :label="$t('navbar.REGISTER_LABEL')" />
        </div>
      </q-list>
    </q-drawer>
    
  </q-header>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Header',
  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
}
</script>