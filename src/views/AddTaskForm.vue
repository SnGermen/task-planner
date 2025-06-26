<template>
 <SearchTags @sendTags="filterBytag"/>
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
    <button @click="moveToTrash(task.id)" class="task_delete">🗑️</button>
  </div>
</template>


<script setup>
import { useModalsStore } from '../stores/ModalsDate'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useActivePageStore } from '../stores/activePage' 
import { saveTask } from '../data/db'
import SearchTags from "./SearchTags.vue"

const modalsStore = useModalsStore()
const activePageStore = useActivePageStore()
const currentTag = ref("")

const { modalDates } = storeToRefs(modalsStore)
const { activePage } = storeToRefs(activePageStore)

const filter = computed(() =>{
  return modalDates.value.filter(task =>{
    const categoryMatch = task.category == activePage.value
    const tagSearch = currentTag.value.replace(/^#/, "")
    const tagMatch = currentTag.value
    ?(task.tags || "")
    .split(" ")
    .some(tag => tag.replace(/^#/, "").startsWith(tagSearch))
  :true
  return categoryMatch && tagMatch

})
})
function filterBytag(tag){
  currentTag.value = tag.trim()
}

async function moveToTrash(taskId) {
  const task = modalDates.value.find(t => t.id === taskId)
  if (task) {
    task.isTrashed = true
    task.category = "trash"
    await saveTask({ ...task })
  }
}

async function moveToDone(taskId, isDone) {
  const task = modalDates.value.find(t => t.id === taskId)
  if (!task) return

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

.task_text
  display: flex
  flex-direction: column
  flex-grow: 1

.task_title
  font-size: 30px
  font-weight: 600
  color: #fff

.task_description
  font-size: 2vh
  word-wrap: break-word
  max-width: 1000px
  width: 100%
  line-height: 1.4
.task_tags
  font-size: 15px
  color: rgba(255, 255, 255, 0.6)


.task_delete
  position: absolute
  top: 50%
  right: 20px
  transform: translateY(-50%)
  background: transparent
  border: none
  color: #aaa
  font-size: 22px
  cursor: pointer

  &:hover
    color: #e74c3c


</style>
