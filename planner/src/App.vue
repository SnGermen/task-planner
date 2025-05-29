<template>
  <Sections />
</template>

<script setup>
import { useModalsStore } from './stores/ModalsDate'
import Sections from './configs/sections.vue'

const modalsStore = useModalsStore()
</script>
<style scoped>
</style>
