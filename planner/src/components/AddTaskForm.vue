<template>
  <div v-for="task in tasks" :key="task.id" class="task">
    <div class="title">{{ task.title }}</div>
    <div class="description">{{ task.description }}</div>
  </div>
</template>

<script setup>
import { useModalsStore } from '../stores/ModalsDate'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

const modalsStore = useModalsStore()
const {activePage, modalDates} = storeToRefs(modalsStore)
const tasks = computed(() => modalsStore.modalDates.filter(e=>e))


const filter = computed(() => modalDates.value.filter(e=>e.category == activePage.value))
</script>

<style scoped>
.task {
  color: white;
  padding: 10px;
  border: 1px solid white;
  border-radius: 10px;
  margin: 10px 10px;
}
.title {
  font-weight: bold;
  font-size: 25px;
}
.description {
  margin-top: 5px;
  font-size: 15px;
}
</style>
