<template>
  <q-input
    :id="properties.id + '-field'"
    type="'text'"
    :autocomplete="properties.autocomplete ? properties.autocomplete : 'off'"
    clearable
    :label="$t(properties.label)"
    v-model="model"
    @update:model-value="Events.emit('field-changed', properties.id, model)"
    dense: true
    bottom-slots
  >
  </q-input>
</template>

<script setup>
import _ from 'lodash'
import { ref } from 'vue'
import { Events } from '../../utils/utils.events'

// Props
const props = defineProps(['properties'])

// Data
const model = ref('')
</script>