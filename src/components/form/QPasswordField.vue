<template>
  <q-input
    :id="properties.id + '-field'"
    :type="showPassword ? 'password' : 'text'"
    clearable
    :label="$t(properties.label)"
    v-model="model"
    @update:model-value="Events.emit('field-changed', properties.id, model)"
    :autocomplete="properties.autocomplete ? properties.autocomplete : 'off'"
    dense: true
    bottom-slots
  >
    <!-- Visibility icon -->
    <template v-slot:append>
      <q-icon
        :id="properties.name + '-field-visibility'"
        :name="showPassword ? 'visibility_off' : 'visibility'"
        class="q-pl-md cursor-pointer"
        @click="showPassword = !showPassword"
      />
    </template>
  </q-input>
</template>

<script setup>
import _ from 'lodash'
import { ref } from 'vue'
import { Events } from '../../utils/utils.events'

// Props
const props = defineProps(['properties'])

// Data
const showPassword = ref(true)
const model = ref('')
</script>