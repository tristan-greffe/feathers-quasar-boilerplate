<template>
  <q-page class="row justify-center items-center window-height window-width">
    <div style="min-width: 70%">
      <q-card bordered :class="computedClass" class="full-width q-pa-sm">
        <!--
          Header section
        -->
        <div v-bind:class="{ 'q-px-sm q-pt-xs': dense, 'q-px-md q-pt-sm': !dense }">
          <div class="q-pa-sm row justify-center">
            <q-img :src="Logo" width="250px" />
          </div> 
        </div>
        <!--
          Content section
        -->
        <div v-bind:class="{ 'q-px-sm': dense, 'q-px-md': !dense }">
          <slot name="card-content" />
        </div>
        <!--
          Action section
        -->
        <div v-bind:class="{ 'q-px-sm': dense, 'q-px-md': !dense }">
          <q-card-actions align="center">
            <slot name="card-action" />
          </q-card-actions>
        </div>
        <!--
          Footer section
        -->
        <div v-if="hasFooter">
          <div v-bind:class="{ 'q-px-sm q-py-xs': dense, 'q-px-md q-py-sm': !dense }">
            <slot name="card-footer">
              {{ footer }}
            </slot>
          </div>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import _ from 'lodash'
import Logo from '../assets/logo.png'

// Props
const props = defineProps(['footer', 'shadow', 'avatar', 'name', 'description', 'dense'])

// Computed
const computedClass = computed(() => props.shadow > 0 ? `shadow-${props.shadow}` : 'no-shadow')
const hasAvatar = computed(() => !_.isUndefined(props.avatar))
const hasFooter = computed(() => !_.isUndefined(props.footer))
</script>
