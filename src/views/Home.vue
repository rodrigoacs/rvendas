<template>
  <div class="q-pa-md">
    <div class="text-h5">Home</div>
    <div class="text-h6">{{ currentDate }}</div>
  </div>

</template>

<script setup>
import { ref } from 'vue'

const currentDate = ref(new Date().toLocaleString())
setInterval(() => {
  currentDate.value = new Date().toLocaleString()
}, 200)

</script>