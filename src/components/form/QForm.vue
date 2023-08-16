<template>
  <form class="column">
    <template v-for="field in fields" :key="field.name">
      <QPasswordField 
        v-if="field.component === 'QPasswordField'"
        :properties="field"
      />
      <QTextField 
        v-if="field.component === 'QTextField'"
        :properties="field"
      />
      <QTokenField 
        v-if="field.component === 'QTokenField'"
        :properties="field"
      />
    </template>
  </form>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { Events } from '../../utils/utils.events'
import QTextField from './QTextField.vue'
import QPasswordField from './QPasswordField.vue'
import QTokenField from './QTokenField.vue'


// Props
const props = defineProps(['fields'])

// Emit
const emit = defineEmits(['field-changed'])

// Hooks
onMounted(() => Events.on('field-changed', (field, value) => emit('field-changed', field, value)))
onBeforeUnmount(() => Events.off('field-changed'))
</script>
