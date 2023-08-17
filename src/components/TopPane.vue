<template>
  <!-- top pane -->
  <q-page-sticky position="top" class="z-top">
    <div id="top-pane" class="column items-center">
      <!-- top panel -->
      <div v-if="isTopPaneOpened && locationData" class="row items-center pane" direction="horizontal" id="top-panel">
        <div v-if="mode === 'default'" class="q-pl-sm q-pr-sm row items-center no-wrap q-gutter-x-sm text-grey-7" id="location">
          <q-icon name="las la-globe" style="font-size: 24px" />
          <div class="ellipsis" style="font-size: 0.875rem">{{ locationData.country }}</div>
        </div>
        <q-btn v-if="mode !== 'default'" flat round icon="las la-arrow-left" style="color: #424242" @click="setMode('default')" id="back"/>
        <q-separator vertical />
        <div v-if="mode === 'default'" class="row items-center no-padding">
          <q-btn flat round icon="las la-crosshairs" style="color: #424242" @click="setMode('position')">
            <q-tooltip class="bg-accent">{{ $t('Tooltip.DISPLAY_POSITION') }}</q-tooltip>
          </q-btn>
          <q-btn flat round icon="las la-cloud" style="color: #424242;" @click="setMode('weather')">
            <q-tooltip class="bg-accent">{{ $t('Tooltip.DISPLAY_WEATHER') }}</q-tooltip>
          </q-btn>
          <q-separator vertical inset />
          <q-btn v-if="!isFullScreen" flat round icon="las la-expand" style="color: #424242" @click="openFullScreen">
            <q-tooltip class="bg-accent">{{ $t('Tooltip.ENTER_FULLSCREEN') }}</q-tooltip>
          </q-btn>
          <q-btn v-if="isFullScreen" flat round icon="las la-compress" style="color: #424242" @click="closeFullScreen">
            <q-tooltip class="bg-accent">{{ $t('Tooltip.EXIT_FULLSCREEN') }}</q-tooltip>
          </q-btn>
        </div>
        <div v-if="mode === 'position' && locationData" id="position-indicator" class="row items-center no-padding">
          <span class="q-pl-md q-pr-md">{{ _.round(locationData.latitude, 6) }}°N | {{  _.round(locationData.longitude, 6)  }}°W</span>
        </div>
        <div v-if="mode === 'weather' && locationData" class="row items-center no-padding">
          <q-avatar size="30px">
            <img :src="weatherCodes[locationData.weathercode].image" />
          </q-avatar>
          <span>{{ weatherCodes[locationData.weathercode].description }}</span>
          <div class="row items-center no-padding">
            <span class="q-pl-md q-pr-md">
              <q-icon color="blue" name="las la-temperature-low" size="15px"/>
              {{ locationData.tempMin }}°C
              <q-icon color="red" name="las la-temperature-high" size="15px"/>
              {{ locationData.tempMax }}°C
            </span>
          </div>
        </div>
      </div>
      <!-- top opener -->
      <div
        id="top-opener"
        class="row justify-center items-center opener-top"
        v-bind:class="{ 'opener-top-hovered':  isTopPaneHovered && !hasTouch }"
        v-on="!hasTouch ? { mouseover: onMouseOver, mouseleave: onMouseLeave } : {}"
        v-touch-swipe.mouse="onSwipe"
        @click="onClick"
      >
        <q-icon v-if="iconTopOpener" :name="iconTopOpener" color="white" size="sm" />
      </div>

    </div>
  </q-page-sticky>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import _ from 'lodash'

// Props
const props = defineProps(['locationData'])

// data
const $q = useQuasar()
const mode = ref('default')
const isFullScreen = ref(false)
const hasTouch = $q.platform.has.touch
const isTopPaneOpened = ref(true)
const isTopPaneHovered = ref(false)
const iconTopOpener = ref(null)
const weatherCodes = ref({
  0: { description: 'Sunny', image: 'http://openweathermap.org/img/wn/01d@2x.png' },
  1: { description: 'Mainly Sunny', image: 'http://openweathermap.org/img/wn/01d@2x.png' },
  2: { description: 'Partly Cloudy', image: 'http://openweathermap.org/img/wn/02d@2x.png' },
  3: { description: 'Cloudy', image: 'http://openweathermap.org/img/wn/03d@2x.png' },
  45: { description: 'Foggy', image: 'http://openweathermap.org/img/wn/50d@2x.png' },
  48: { description: 'Foggy', image: 'http://openweathermap.org/img/wn/50d@2x.png' },
  51: { description: 'Light Drizzle', image: 'http://openweathermap.org/img/wn/09d@2x.png' },
  53: { description: 'Drizzle', image: 'http://openweathermap.org/img/wn/09d@2x.png' },
  55: { description: 'Heavy Drizzle', image: 'http://openweathermap.org/img/wn/09d@2x.png' },
  56: { description: 'Light Freezing Drizzle', image: 'http://openweathermap.org/img/wn/09d@2x.png' },
  57: { description: 'Freezing Drizzle', image: 'http://openweathermap.org/img/wn/09d@2x.png' },
  61: { description: 'Light Rain', image: 'http://openweathermap.org/img/wn/10d@2x.png' },
  63: { description: 'Rain', image: 'http://openweathermap.org/img/wn/10d@2x.png' },
  65: { description: 'Heavy Rain', image: 'http://openweathermap.org/img/wn/10d@2x.png' },
  66: { description: 'Freezing Rain', image: 'http://openweathermap.org/img/wn/10d@2x.png' },
  67: { description: 'Freezing Rain', image: 'http://openweathermap.org/img/wn/10d@2x.png' },
  71: { description: 'Light Snow', image: 'http://openweathermap.org/img/wn/13d@2x.png' },
  73: { description: 'Snow', image: 'http://openweathermap.org/img/wn/13d@2x.png' },
  75: { description: 'Heavy Snow', image: 'http://openweathermap.org/img/wn/13d@2x.png' },
  77: { description: 'Snow Grains', image: 'http://openweathermap.org/img/wn/13d@2x.png' },
  80: { description: 'Light Showers', image: 'http://openweathermap.org/img/wn/09d@2x.png' },
  81: { description: 'Showers', image: 'http://openweathermap.org/img/wn/09d@2x.png' },
  82: { description: 'Heavy Showers', image: 'http://openweathermap.org/img/wn/09d@2x.png' },
  85: { description: 'Snow Showers', image: 'http://openweathermap.org/img/wn/13d@2x.png' },
  86: { description: 'Snow Showers', image: 'http://openweathermap.org/img/wn/13d@2x.png' },
  95: { description: 'Thunderstorm', image: 'http://openweathermap.org/img/wn/11d@2x.png' },
  96: { description: 'Thunderstorm With Hail', image: 'http://openweathermap.org/img/wn/11d@2x.png' },
  99: { description: 'Thunderstorm With Hail', image: 'http://openweathermap.org/img/wn/11d@2x.png' },
})

// Functions
function setMode (item) {
  mode.value = item
}
function openFullScreen () {
  const element = document.querySelector("#q-app")
  if (element.requestFullscreen) element.requestFullscreen()
  if (element.webkitRequestFullscreen) element.webkitRequestFullscreen()  /* Safari */
  if (element.msRequestFullscreen) element.msRequestFullscreen()  /* IE11 */
  isFullScreen.value = true
}
function closeFullScreen () {
  if (document.exitFullscreen) document.exitFullscreen()
  if (document.webkitExitFullscreen) document.webkitExitFullscreen()  /* Safari */
  if (document.msExitFullscreen) document.msExitFullscreen()  /* IE11 */
  isFullScreen.value = false
}
function onMouseOver () {
  if (hasTouch) return
  isTopPaneHovered.value = true
  iconTopOpener.value = isTopPaneOpened.value ? 'las la-angle-up' : 'las la-angle-down'
}
function onMouseLeave () {
  if (hasTouch) return
  isTopPaneHovered.value = false
  iconTopOpener.value = null
}
function onSwipe ({ evt, ...info }) {
  if (!info && !info.direction) return
  if (info.direction === 'up' && isTopPaneOpened.value) onClick()
  if (info.direction === 'down' && !isTopPaneOpened.value) onClick()
}
function onClick () {
  isTopPaneOpened.value = !isTopPaneOpened.value
}

// Immediately
document.addEventListener('fullscreenchange', ()  => {
	document.fullscreenElement !== null ? isFullScreen.value = true : isFullScreen.value = false
})
</script>

<style lang="scss">
.pane {
  background-color: #FFFFFF;
  border: solid 1px lightgrey;
  border-radius: 3px;
}
.pane:hover {
  border: solid 1px $primary;
}
.opener-top {
  opacity: 0.85;
  transition: 0.2s;
  background-color: var(--q-primary);
  border: 2px solid var(--q-secondary);
  height: 24px;
  width: 110px;
  border-radius: 0px 0px 8px 8px;
}
.opener-top-hovered {
  cursor: pointer;
  opacity: 1;
  height: 30px;
}
</style>
