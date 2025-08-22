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
      <a 
        v-if="task.name && task.category == 'waiting'"
        class="task__name"
        @click="filterByName(task.name)"
        >
          👤{{ task.name }}
      </a>

      <a @click="goToProject(task.projectKey)" class="task__project"> {{title(task.projectKey)}}</a>
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
  <AddProjectToTheTrash />
</template>

<script setup>
import { useModalsStore } from '../stores/ModalsDate'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useActivePageStore } from '../stores/activePage'
import { saveTask } from '../data/db'
import { storeOfTags, storeOfName} from "../stores/SearchTagsOrName"
import { deleteTask } from '../data/db'
import ConfigurateTheTask from "../views/ConfigurateTheTask.vue"
import {useProjectStore} from "../stores/ProjectsDate"
import { sections } from "../data/sections"
import AddProjectToTheTrash from "../views/AddProjectToTheTrash.vue"

const projectStore = useProjectStore()
const modalsStore = useModalsStore()
const activePageStore = useActivePageStore()
const tagsStore = storeOfTags()
const nameStore = storeOfName()
const { modalDates } = storeToRefs(modalsStore)
const { activePage } = storeToRefs(activePageStore)
const { saveTags } = storeToRefs(tagsStore)
const { saveName } = storeToRefs(nameStore)
const modalConfig  = ref(false)
const selectedTask = ref(null)

function title(projectKey){
  return projectStore.getProjectTitle(projectKey)
}
function goToProject(projectKey) {
  const  project = sections.value.find(sec=> sec.key == projectKey)
  if(project){
    activePageStore.activePage = project.key
  }
}

const onlyNewDelatedSections = computed(() => {
    return sections.value.filter((sec) => sec.isNew && sec.category == "trash")
  })

const filter = computed(() => {
  return modalDates.value.filter(task => {
    const tagSearch = (saveTags.value || "").replace(/^#/, "")
    const tagMatch = saveTags.value
      ? (task.tags || "")
          .split(" ")
          .some(tag => tag.replace(/^#/, "").startsWith(tagSearch))
      : true
    const nameSearch = saveName.value || ""
    const nameMatch = saveName.value
      ? (task.name || "").toLowerCase().includes(nameSearch.toLowerCase())
      : true

    const activeSection = sections.value.find(sec => sec.key == activePage.value)
    if(!activeSection) return false

if(!activeSection.isNew){
  return task.category === activeSection.key && tagMatch && nameMatch
}
if(activeSection.isNew){
  if(!task.projectKey){
    task.projectKey = activePage.value
  }
  return task.projectKey === activeSection.key   && tagMatch && nameMatch
}
   return false
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
function filterByTad(tag) {
  const tagWithoutHash = tag.replace(/^#/, "")
  saveTags.value = tagWithoutHash
}

function filterByName(name) {
  saveName.value = name
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
    transition: background-color 0.3s, box-shadow 0.3s

    &:hover
      background-color: #2a2a2a

  &__done
    border-left: 4px solid #27ae60
    transition: background-color 0.3s, box-shadow 0.3s, border-color 0.3s

    &:hover
      background: linear-gradient(90deg, rgba(39, 174, 96, 0.15), #2a2a2a)
      box-shadow: 0 0 15px rgba(39, 174, 96, 0.4)
      border-left-color: #2ecc71

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

  &__project
    color: #1abc9c
    text-decoration: none
    cursor: pointer

    &:hover
      text-decoration: none   
      background-color: transparent

  &__text
    display: flex
    flex-direction: column
    flex-grow: 1
    max-width: 100%
    overflow: hidden

  &__title,
  &__description,
  &__tags,
  &__name
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
    transition: background 0.2s

    &:hover
      background: #f39c12

  &__title
    font-size: clamp(18px, 2vw, 30px)
    font-weight: 600
    color: #fff

  &__description
    font-size: clamp(12px, 1.2vw, 18px)
    line-height: 1.4

  &__tags
    font-size: clamp(14px, 1vw, 15px)
    color: rgba(255, 255, 255, 0.6)
    max-width: 95%
  &__name
    display: inline-block
    background: #3c2c54   
    color: #fff
    padding: 3px 10px
    border-radius: 8px
    font-size: 13px
    font-weight: 500
    cursor: pointer
    margin: 2px 0
    transition: background 0.2s
    width: fit-content

    &:hover
      background: #5e3d82

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

/* Media Queries для мелких экранов (если нужно дополнительное масштабирование) */
@media (max-width: 499px)
  .task
    &__checkbox
      min-width: 18px
      height: 18px
    &__actions
      gap: 0px
      right: -4px

@media (min-width: 500px) and (max-width: 699px)
  .task
    &__checkbox
      min-width: 20px
      height: 20px
    &__actions
      gap: 5px
      right: -4px

@media (min-width: 700px) and (max-width: 899px)
  .task
    &__checkbox
      min-width: 22px
      height: 22px

@media (min-width: 900px) and (max-width: 1199px)
  .task
    &__checkbox
      min-width: 24px
      height: 24px

@media (min-width: 1200px) and (max-width: 1599px)
  .task
    &__checkbox
      min-width: 26px
      height: 26px

@media (min-width: 1600px)
  .task
    &__checkbox
      min-width: 30px
      height: 30px

</style>
