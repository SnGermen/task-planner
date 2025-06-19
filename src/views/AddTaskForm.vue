<template>
  <div
    v-for="task in filter"
    :key="task.id"
    class="task">
    <input 
      type="checkbox" 
      :checked="task.isDone"
      @change="moveToDone(task.id, $event.target.checked)" 
      class="checkbox"
    >
    <div class="task_text">
      <div class="task_title">{{ task.title }}</div>
      <div class="task_description">{{ task.description }}</div>
    </div>
    <button @click="moveToTrash(task.id)" class="task_delete">🗑️</button>
  </div>
</template>


<script setup>
import { useModalsStore } from '../stores/ModalsDate'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useActivePageStore } from '../stores/activePage' 
import { saveTask } from '../data/db'

const modalsStore = useModalsStore()
const activePageStore = useActivePageStore()

const { modalDates } = storeToRefs(modalsStore)
const { activePage } = storeToRefs(activePageStore)

const filter = computed(() =>
  modalDates.value.filter(e => e.category === activePage.value )
)

async function moveToTrash(taskId) {
  const task = modalDates.value.find((t) => t.id == taskId)
  if (task) {
    task.isTrashed = true
    task.category = "trash"
    await saveTask({ ...task }) // <-- прямой вызов
  }
}

async function moveToDone(taskId, isDone) {
  const task = modalDates.value.find((t) => t.id == taskId)
  if (!task) return

  if (isDone) {
    if (!task.originCategory) {
      task.originCategory = task.category
    }
    task.category = "done"
    task.isDone = true
  } else {
    task.category = task.originCategory || task.category
    task.isDone = false
  }

  await saveTask({ ...task }) // <-- прямой вызов
}
</script>



<style scoped lang="sass">
.task
  position: relative
  display: flex
  align-items: center
  color: white
  padding: 10px 50px 10px 10px
  border: 1px solid white
  border-radius: 10px
  margin: 10px
  background-color: #222
  transition: background-color 0.3s ease

  &:hover
    background-color: #333

.checkbox
  width: 20px
  height: 20px
  cursor: pointer
  margin-right: 15px
  -webkit-appearance: none
  -moz-appearance: none
  appearance: none
  border: 2px solid white
  border-radius: 5px
  background-color: transparent
  position: relative
  transition: background-color 0.3s ease, border-color 0.3s ease

  &:checked
    background-color: #f1c40f
    border-color: #f1c40f

    &::after
      content: ""
      position: absolute
      left: 5px
      top: 2px
      width: 5px
      height: 10px
      border: solid white
      border-width: 0 2px 2px 0
      transform: rotate(45deg)

.task_text
  display: flex
  flex-direction: column

.task_title
  font-weight: bold
  font-size: 25px

.task_description
  margin-top: 5px
  font-size: 15px

.task_delete
  position: absolute
  top: 50%
  right: 15px
  transform: translateY(-50%)
  background: transparent
  border: none
  color: #bbb
  font-size: 22px
  cursor: pointer
  transition: color 0.3s ease, transform 0.3s ease

  &:hover
    color: #ff4d4d
    transform: translateY(-50%) scale(1.2)

</style>
