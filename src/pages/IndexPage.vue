<template>
  <q-layout view="lHh Lpr lFf">
  <q-page-container>
    <q-page class="relative-position">
      <Sidebar />
      <div id="map" ref="mapRef"></div>
    </q-page>
  </q-page-container>
</q-layout>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Sidebar from '../components/Sidebar'
// Data
const mapRef = ref(null)
const markerRef = ref(null)

// onMounted
onMounted(() => {
  const map = L.map(mapRef.value).setView([46.05, 11.05], 5)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map)
  
  markerRef.value = L.marker([51.5, -0.09]).addTo(map).bindPopup('hello')
})
</script>