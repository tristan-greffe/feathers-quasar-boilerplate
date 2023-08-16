<template>
  <p class="row justify-center">{{ $t(properties.label) }}</p>
  <div class="row q-gutter-x-sm justify-center">
    <q-input 
      v-for="i in properties.tokenLength"
      :for="properties.id + '-field' + i"
      :id="properties.id + '-field'  + i"
      :key="properties.id + '-field'  + i"
      type="text"
      mask="#"
      v-model="fieldValues[i - 1]"
      style="width: 5ch"
      outlined
      :ref="el => updateFieldRef(el, i - 1)"
      @update:model-value='updateModel(i)'
      @keyup="onKeyUp($event, i - 1)"
      bottom-slots
    >
    </q-input>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref } from 'vue'
import { Events } from '../../utils/utils.events'

// Props
const props = defineProps(['properties'])

// Data
const fieldValues = ref([])
const fields = ref([])
const model = ref('')

// Functions
function updateModel (index) {
  model.value = _.join(fieldValues.value, '')
  focusNextInput(index)
  Events.emit('field-changed', props.properties.id, model.value)
  
}
function updateFieldRef (element, index) {
  if (element) fields.value[index] = element
}
function focusNextInput (index) {
  if (_.inRange(index, 0, props.properties.tokenLength)) fields.value[index].select()
}
function clearInput (index) {
  fieldValues.value[index] = ''
}
function onKeyUp (event, index) {
  const key = event.key
  if (key === 'ArrowLeft' || key === 'Backspace') {
    focusNextInput(index - 1)
    clearInput(index - 1)
  }
  if (key === 'ArrowRight') focusNextInput(index + 1)
}
</script>
