<template>
  <div
    v-for="task in filter"
    :key="task.id"
    class="task__container"
    :class="{
      'task__done': task.isDone && task.category !== 'trash',
      'task__trashed': task.category === 'trash'
    }">
    <input 
      type="checkbox" 
      :checked="task.isDone"
      @change="moveToDone(task.id, $event.target.checked)" 
      class="task__checkbox"
    >
    <div class="task__text">
      <div class="task__title">{{ task.title }}</div>
      <div class="task__description">{{ task.description }}</div>
      <div v-if="task.tags" class="task__tags">
        <a v-for="tag in filteredTags(task.tags)"
        key="tag"
        class="task__links" 
        @click="filterByTad(tag)">
         {{ tag }}
      </a>
    </div>
    </div>
    <div class="task__actions">
      <button v-if="task.category !=='trash'" class="task__btn" @click="toggleConfig(task)">⚙️</button>
      <button v-if="task.category === 'trash'" @click="restoreTask(task.id)" class="task__btn task__btn--resolve">♻️</button>
      <button @click="moveToTrash(task.id)" class="task__btn task__btn--delete">🗑️</button>
    </div>
  </div>
  <ConfigurateTheTask 
    v-if="modalConfig" 
    :task="selectedTask"
    @close="modalConfig = false"
  />
</template>

<script setup>
import { useModalsStore } from '../stores/ModalsDate'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useActivePageStore } from '../stores/activePage'
import { saveTask } from '../data/db'
import { storeOfTags } from "../stores/SearchTags"
import { deleteTask } from '../data/db'
import ConfigurateTheTask from "../views/ConfigurateTheTask.vue"

const modalsStore = useModalsStore()
const activePageStore = useActivePageStore()
const tagsStore = storeOfTags()
const { modalDates } = storeToRefs(modalsStore)
const { activePage } = storeToRefs(activePageStore)
const { saveTags } = storeToRefs(tagsStore)

const modalConfig  = ref(false)
const selectedTask = ref(null)


const filter = computed(() => {
  return modalDates.value.filter(task => {
    const categoryMatch = task.category == activePage.value
    const tagSearch = (saveTags.value || "").replace(/^#/, "")
    const tagMatch = saveTags.value
      ? (task.tags || "")
          .split(" ")
          .some(tag => tag.replace(/^#/, "").startsWith(tagSearch))
      : true
    return categoryMatch && tagMatch
  })
})


function toggleConfig(task) {
  selectedTask.value = task
  modalConfig.value = true
}

async function moveToTrash(taskId) {
  const task = modalDates.value.find(t => t.id === taskId)
  if (task.category === "trash") {
    await deleteTask(taskId)
    modalDates.value = modalDates.value.filter(t => t.id !== taskId)
    return
  }
  if (task) {
    task.originCategory = task.category 
    task.isTrashed = true
    task.category = "trash"
    await saveTask({ ...task })
  }
}
function filterByTad(tag){
  saveTags.value = tag
}

function filteredTags(tags){
  if (!tags) return []
  return[ ...new Set(
    tags
      .trim()
      .split(/\s+/) 
      .map(tag => tag.startsWith('#') ? tag : '#' + tag)
  )]
}

async function restoreTask(taskId) {
  const task = modalDates.value.find(t => t.id === taskId)
  if (!task || task.category !== "trash") return

  task.category = task.originCategory
  task.isTrashed = false
  await saveTask({ ...task })
}

async function moveToDone(taskId, isDone) {
  const task = modalDates.value.find(t => t.id === taskId)
  if (!task || task.category === "trash") return

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
  &__container
    position: relative
    display: flex
    align-items: center
    padding: 16px 62px 16px 16px
    margin: 12px 0
    width: 100%
    border-radius: 12px
    border: 1px solid #444
    background-color: #1e1e1e
    overflow-wrap: break-word

    &:hover
      background-color: #2a2a2a
  &__done
      border-left: 4px solid #27ae60
  &__trashed
      border-left: 4px solid #e74c3c
  &__checkbox
    min-width: 22px
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
  &__text
    display: flex
    flex-direction: column
    flex-grow: 1
    max-width: 100%
    overflow: hidden
  &__title,
  &__description,
  &__tags
    word-break: break-word
    overflow-wrap: break-word
    white-space: normal
  &__links
    background: #2c2c2c
    color: white
    padding: 3px 8px
    border-radius: 6px
    font-size: 14px
    margin: 2px
    cursor: pointer
    text-decoration: none

    &:hover
      background: #f39c12

  &__title
    font-size: 30px
    font-weight: 600
    color: #fff

  &__description
    font-size: 16px
    line-height: 1.4

  &__tags
    font-size: 15px
    color: rgba(255, 255, 255, 0.6)

  &__actions
    display: flex
    align-items: center
    gap: 8px
    position: absolute
    right: 20px
    top: 50%
    transform: translateY(-50%)

  &__btn
    background: transparent
    border: none
    font-size: 22px
    cursor: pointer
    color: #aaa
    transition: color 0.2s

    &:hover
      color: #fff

  &__btn--resolve
    color: #4cd137

  &__btn--delete
    color: #e74c3c
@media (min-width: 360px) and (max-width: 499px)
  .task
    &__title
      font-size: 18px
    &__description
      font-size: 12px
    &__checkbox
      min-width: 18px
      height: 18px
    &__actions
      gap: 0px
      right: -4px
    &__tags
      max-width: 85%
      font-size: 14px
@media (min-width: 500px) and (max-width: 699px)
  .task
    &__title
      font-size: 20px  
      max-width: 85%
    &__description
      font-size: 13px
      max-width: 85%
    &__checkbox
      min-width: 20px
      height: 20px
    &__actions
      gap: 5px
      right: -4px
    &__tags
      max-width: 85%
@media (min-width: 700px) and (max-width: 899px)
  .task
    &__title
      font-size: 22px
      max-width: 370px
    &__description
      font-size: 14px
      max-width: 370px
    &__checkbox
      min-width: 22px
      height: 22px
    &__tags
      max-width: 370px
@media (min-width: 900px) and (max-width: 1199px)
  .task
    &__title
      font-size: 24px
      max-width: 490px
    &__description
      font-size: 15px
      max-width: 490px
    &__checkbox
      min-width: 24px
      height: 24px
@media (min-width: 1200px) and (max-width: 1599px)
  .task
    &__title
      font-size: 26px
      max-width: 740px
    &__description
      font-size: 16px
      max-width: 740px
    &__checkbox
      min-width: 26px
      height: 26px
    &__tags
      max-width: 740px
@media (min-width: 1600px)
  .task
    &__title
      font-size: 30px
      max-width: 95%

    &__description
      font-size: 18px
      max-width: 95%
    &__checkbox
      min-width: 30px
      height: 30px
    &__tags
      max-width: 95%
</style>
