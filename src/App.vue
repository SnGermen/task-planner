<template>
  <Sections />
</template>

<script setup>
import { onMounted } from 'vue'
import { useModalsStore } from './stores/ModalsDate'
import Sections from './components/sections.vue'

const modalsStore = useModalsStore()

onMounted(() => {
  modalsStore.initStore()  
})
</script>

<style scoped>
</style>
