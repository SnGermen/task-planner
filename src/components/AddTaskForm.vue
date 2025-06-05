<template>
  <div
    v-for="task in filter"
    :key="task.id"
    class="task"
  >
    <div class="task_title">{{ task.title }}</div>
    <div class="task_description">{{ task.description }}</div>
  </div>
</template>

<script setup>
import { useModalsStore } from '../stores/ModalsDate'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

const modalsStore = useModalsStore()
const { activePage, modalDates } = storeToRefs(modalsStore)

const filter = computed(() =>
  modalDates.value.filter(e => e.category === activePage.value)
)
</script>

<style scoped lang="sass">
.task
  color: white
  padding: 10px
  border: 1px solid white
  border-radius: 10px
  margin: 10px

.task_title
  font-weight: bold
  font-size: 25px

.task_description
  margin-top: 5px
  font-size: 15px
</style>
