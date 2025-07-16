<template>
 <div
    v-for="task in filter"
    :key="task.id"
    class="task"
    :class="{ done: task.isDone, trashed: task.category === 'trash' }"
  >
    <input 
      type="checkbox" 
      :checked="task.isDone"
      @change="moveToDone(task.id, $event.target.checked)" 
      class="checkbox"
    >
    <div class="task_text">
      <div class="task_title">{{ task.title }}</div>
      <div class="task_description">{{ task.description }}</div>
      <div v-if="task.tags" class="task_tags">{{ task.tags }}</div>

    </div>

  <div class="task_actions">
  <button v-if="task.category !=='trash'" class="configurate" @click="toggleConfig(task)">⚙️</button>
  <button v-if="task.category == 'trash'" @click="restoreTask(task.id)" class="task_resolve">♻️</button>
  <button @click="moveToTrash(task.id)" class="task_delete">🗑️</button>
</div>

  </div>
    <ConfigurateTheTask 
    v-if="modalConfig " 
    :task="selectedTask"
    @close="modalConfig = false"/>
</template>


<script setup>
import { useModalsStore } from '../stores/ModalsDate'
import { computed, ref,  } from 'vue'
import { storeToRefs } from 'pinia'
import { useActivePageStore } from '../stores/activePage' 
import { saveTask } from '../data/db'
import {storeOfTags} from "../stores/SearchTags"
import {deleteTask} from '../data/db'
import ConfigurateTheTask from "../views/ConfigurateTheTask.vue"

const modalsStore = useModalsStore()
const activePageStore = useActivePageStore()
const tagsStore = storeOfTags()
const { modalDates } = storeToRefs(modalsStore)
const { activePage } = storeToRefs(activePageStore)
const {saveTags} = storeToRefs(tagsStore)
const modalConfig  = ref(false)
const selectedTask = ref(null)


const filter = computed(() =>{
  return modalDates.value.filter(task =>{
    const categoryMatch = task.category == activePage.value
    const tagSearch = (saveTags.value || "").replace(/^#/, "")
    const tagMatch = saveTags.value
    ?(task.tags || "")
    .split(" ")
    .some(tag => tag.replace(/^#/, "").startsWith(tagSearch))
  :true
  return categoryMatch && tagMatch

})
})

function toggleConfig(task){
  selectedTask.value = task
  modalConfig.value = true
}

async function moveToTrash(taskId) {
  const task = modalDates.value.find(t => t.id === taskId)
  if(task.category == "trash"){
    await deleteTask(taskId)
    modalDates.value = modalDates.value.filter(t => t.id !== taskId) // убрать из интерфейса

    return
  }
  if (task) {
    task.originCategory = task.category 
    task.isTrashed = true
    task.category = "trash"
    await saveTask({ ...task })
  }

}
async function restoreTask(taskId){
  const task = modalDates.value.find(t => t.id === taskId)
  if(!task || task.category !== "trash") return

  task.category = task.originCategory
  task.isTrashed = false
  await saveTask({ ...task})
}

async function moveToDone(taskId, isDone) {
  const task = modalDates.value.find(t => t.id === taskId)
  if (!task || task.category == "trash") return
 
  if (isDone) {
    if (!task.originCategory) task.originCategory = task.category
    task.category = "done"
    task.isDone = true
  } else {
    task.category = task.originCategory || task.category
    task.isDone = false
  }

  await saveTask({ ...task })
}
</script>

<style scoped lang="sass">
.task
  position: relative
  display: flex
  align-items: center
  padding: 16px 60px 16px 16px
  margin: 12px 0
  width: 100%
  border-radius: 12px
  border: 1px solid #444
  background-color: #1e1e1e

  &:hover
    background-color: #2a2a2a
  &.done
    border-left: 4px solid #27ae60

  &.trashed
    border-left: 4px solid #e74c3c

  &_text
    display: flex
    flex-direction: column
    flex-grow: 1

  &_title
    font-size: 30px
    font-weight: 600
    color: #fff

  &_description
    font-size: 2vh
    word-wrap: break-word
    max-width: 1000px
    width: 100%
    line-height: 1.4

  &_tags
    font-size: 15px
    color: rgba(255, 255, 255, 0.6)

  &_delete
    position: absolute
    top: 50%
    right: 20px
    transform: translateY(-50%)
    background: transparent
    border: none
    color: #aaa
    font-size: 22px
    cursor: pointer

  &_resolve
    margin-left: 8px
    cursor: pointer
    background: none
    border: none
    font-size: 1.2rem
    color: #4cd137

.checkbox
  width: 22px
  height: 22px
  margin-right: 18px
  border: 2px solid white
  border-radius: 6px
  background: transparent
  appearance: none
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer

  &:checked
    background-color: #f1c40f
    border-color: #f1c40f

    &::after
      content: ""
      width: 6px
      height: 10px
      border: solid white
      border-width: 0 2px 2px 0
      transform: rotate(45deg)

.task_actions
  display: flex
  align-items: center

.configurate,
.task_delete,
.task_resolve
  background: transparent
  border: none
  font-size: 22px
  cursor: pointer
  color: #aaa
  transition: color 0.2s

  &:hover
    color: #fff

.task_resolve
  color: #4cd137

.task_delete
  color: #e74c3c
</style>
