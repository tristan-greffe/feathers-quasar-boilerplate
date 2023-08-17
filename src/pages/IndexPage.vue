<template>
  <TopPane :locationData="locationData"/>
  <div id="map" ref="mapRef"></div>
  <Fab />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import axios from 'axios'
import config from 'config'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { i18n } from '../i18n'
import TopPane from '../components/TopPane.vue'
import Fab from '../components/Fab.vue'

// Data
const locationData = ref({
  latitude: 48.866667,
  longitude: 2.333333,
  country: null,
  weathercode: null,
  tempMin: null,
  tempMax: null
})
const mapRef = ref(null)
const markerRef = ref(null)

// Functions
async function getCurrentWeather (latitude, longitude) {
  const params = {
    latitude,
    longitude,
    daily: 'weathercode,temperature_2m_max,temperature_2m_min',
    forecast_days: 1,
    timezone: 'auto'
  }
  try {
    const response = await axios.get(config.weatherApi, { params })
    const data = response.data.daily
    locationData.value.weathercode = _.toString(data.weathercode)
    locationData.value.tempMin = _.toString(data.temperature_2m_min)
    locationData.value.tempMax = _.toString(data.temperature_2m_max)
  } catch (error) {
    Notify.create({
      type: 'negative', 
      message: i18n.t('errors.' + error.code) 
    })
  }
}
async function getCurrentAddress (latitude, longitude) {
  const params = {
    lat: latitude,
    lon: longitude,
    format: 'jsonv2',
    zoom: 12
  }
  try {
    const response = await axios.get(config.geolocationApi, { params })
    const data = response.data
    locationData.value.country = data.address.country
  } catch (error) {
    Notify.create({
      type: 'negative', 
      message: i18n.t('errors.' + error.code) 
    })
  }
}

// Hooks
onMounted ( async () => {
  // Get current position
  const position = [locationData.value.latitude, locationData.value.longitude]
  // Create map
  const map = L.map(mapRef.value).setView(position, 5)
  // Initialize OpenStreetMap title
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map)
  // Create draggable marker
  markerRef.value = new L.marker(position, { draggable: true }).addTo(map)
  // Listen draggable marker
  markerRef.value.on('dragend', event => {
    // Get current position
    const position = markerRef.value.getLatLng()
    // Set marker position
    markerRef.value.setLatLng(position, { draggable: 'true' }).bindPopup(position).update()
    // Refocus the map view
    map.panTo(new L.LatLng(position.lat, position.lng))
    // Set data
    locationData.value.latitude = position.lat
    locationData.value.longitude = position.lng
    getCurrentWeather(position.lat, position.lng)
    getCurrentAddress(position.lat, position.lng)
  })
})

// Immediate
getCurrentWeather(locationData.value.latitude, locationData.value.longitude)
getCurrentAddress(locationData.value.latitude, locationData.value.longitude)
</script>