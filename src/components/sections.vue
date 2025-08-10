<template>
  <div class="wrapper">
    <nav class="wrapper__menu">
      <div class="logo">Germen</div>
      <a 
        v-for="section in onlyOldSections"
        :key="`menu-${section.key}`"
        class="wrapper__menu_item"
        @click.prevent="goToSection(section.key)"
        :class="{active: section.key == activePage}"
      >
        {{ section.title }}
      </a> 
      <NewProject/>
      <a
        v-for="section in onlyNewSections"
        :key="`menu-${section.key}`"
        class="wrapper__menu_newItem"
        @click.prevent="goToSection(section.key)"
        :class="{active: section.key == activePage}"
      >
      <button class="wrapper__delete" @click="projectStore.moveProjectToTheTrash(section.key) ">❌</button>
      <!-- <button class="wrapper__delete" @click="projectStore.removeProject(section.key) ">❌</button> -->
       <span class="wrapper__text_new"> {{ section.title }} </span>
      </a> 
    </nav>

    <div class="wrapper__content">
      <input  
        v-if="activeSection?.isNew" 
        type="text" 
        class="wrapper__title" 
        v-model="getActiveSectionTitle"
      >
      <div v-else class="wrapper__title">{{ activeSection?.title }}</div>

      <button
        v-if="isAddButtonVisible"
        class="wrapper__add-button"
        @click="toggleModal"
      >
        Add Task
      </button>
      <ModalAdd v-if="showModal" @close="toggleModal" />
      
      <div class="wrapper__header">
        <SearchTags />
        <AddTaskForm />
      </div>
    </div>

    <div class="pomodoro">
      <button
        class="pomodoro__button"
        @click="togglePomodoro"
        :class="{ 
          'pomodoro__button_open': isPomodoroOpen, 
          'pomodoro__button_active': isRunning 
        }"
      >
        {{ isRunning ? formattedTime : "🍅" }}
      </button>
      <PomodoroTimer 
        v-if="isPomodoroOpen" 
        @close="isPomodoroOpen = false"
        @statusOfTheTimer="handlePomodoroStatus"
      />     
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { storeToRefs } from "pinia"
import { sections } from "../data/sections.js"
import { useActivePageStore } from "../stores/activePage.js"
import ModalAdd from "../views/ModalAdd.vue"
import AddTaskForm from "../views/AddTaskForm.vue"
import SearchTags from "../views/SearchTags.vue"
import PomodoroTimer from "../views/Pomodoro.vue" 
import NewProject from "../views/NewProject.vue"
import { usePomodoro } from "../stores/pomodoro.js" 
import { useProjectStore} from "../stores/ProjectsDate.js"
import { deleteProject, saveNewProject} from "../data/db.js"

const activePageStore = useActivePageStore()
const pomodoro = usePomodoro()
const { activePage } = storeToRefs(activePageStore)
const showModal = ref(false)
const isPomodoroOpen = ref(false)
const { formattedTime, isRunning } = storeToRefs(pomodoro)
const projectStore = useProjectStore()
const {onlyNewSections, onlyOldSections} = storeToRefs(useProjectStore())
const activeSection  = computed(() => {
  return sections.value.find(sec => sec.key === activePage.value)
})

function togglePomodoro() {
  isPomodoroOpen.value = !isPomodoroOpen.value
}

function toggleModal() {
  showModal.value = !showModal.value
}

function handlePomodoroStatus(status){
  isRunning.value = status
}

const goToSection = (key) => {
  activePageStore.setActivePage(key)
}

const getActiveSectionTitle = computed({
  get() {
    return sections.value.find(section => section.key === activePage.value)?.title || ''
  },
  set(newTitle) {
     projectStore.setNameOfTitle(activePage.value, newTitle)

  }
})

const isAddButtonVisible = computed(() =>
  sections.value.find(e => e.key === activePage.value)?.isShowAddTaskButton
)

async function handleDeleteProject(projectId) {
  await deleteProject(projectId)
}


onMounted(() => {
  activePageStore.setActivePage(sections.value[0].key)
})
</script>

<style lang="sass" scoped>
html, body
  overflow-x: hidden 
  overflow-y: auto

.logo
  color: gray
  font-weight: 600
  font-size: 20px
  white-space: nowrap

.wrapper
  display: grid
  grid-template-columns: 300px auto
  width: 100%
  height: 100vh
  background: #121212
  color: #e0e0e0
  overflow-x: hidden
  &__delete
    background: none
    border: none
    font-size: 20px
    cursor: pointer
    padding-left: opx 
  &__menu
    display: flex
    flex-direction: column
    gap: 1rem
    padding: 2rem 1rem
    background-color: #1c1c1c
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2)

    &_item,
    &_newItem
      font-size: 18px
      color: #e0e0e0
      text-decoration: none
      padding: 0.75rem 1rem
      border-radius: 10px
      transition: background-color 0.2s ease, transform 0.2s ease
      cursor: pointer
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      max-width: 100%
      &.active
        background-color: #f39c12  
        color: #121212            
        font-weight: 700       
  
      

      &:hover
        background-color: #2a2a2a
        transform: scale(1.05)

    &__text_new
      display: block
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      max-width: 100%

  &__content
    padding: 1.5rem
    background: #181818
    overflow-y: auto
    overflow-x: hidden
    min-width: 0

  &__title
    font-size: 24px
    margin-bottom: 1rem
    padding: 0.5rem 1rem
    background-color: #2a2a2a
    border: none
    border-radius: 8px
    color: #fff
    width: 100%
    max-width: 100%
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
    height: auto

  &__add-button
    background-color: #444
    color: white
    padding: 0.5rem 1rem
    border-radius: 8px
    border: none
    cursor: pointer
    margin-bottom: 1.5rem
    transition: background-color 0.2s ease
    font-size: clamp(12px, 1.5vw, 16px)
    white-space: nowrap

    &:hover
      background-color: #666

.pomodoro
  position: fixed
  bottom: 20px
  right: 20px

  &__button
    width: 60px
    height: 60px
    border-radius: 50%
    background-color: #ff6347
    color: white
    font-size: 1.5rem
    border: none
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3)
    cursor: pointer
    transition: all 0.3s ease

    &:hover
      transform: scale(1.1)

    &_open
      background-color: #f44336
    &_active
      background-color: green
      font-size: 15px
      font-weight: 700

@media (max-width: 260px)
  .wrapper
    grid-template-columns: 1fr
  .wrapper__menu
    flex-direction: row
    justify-content: space-around
    align-items: center
    padding: 0.5rem
    height: 50px
    position: fixed
    top: 0
    left: 0
    width: 100%
    z-index: 1000
  .wrapper__content
    margin-top: 50px
  .wrapper__menu_item
    font-size: 12px
    padding: 0.25rem

@media (min-width: 360px) and (max-width: 699px)
  .wrapper
    grid-template-columns: 120px 1fr
    &__menu_item
      font-size: 15px
    &__menu_newItem
      font-size: 15px

@media (min-width: 700px) and (max-width: 899px)
  .wrapper
    grid-template-columns: 120px 1fr

@media (min-width: 900px) and (max-width: 1199px)
  .wrapper
    grid-template-columns: 200px 1fr

@media (min-width: 1200px) and (max-width: 1399px)
  .wrapper
    grid-template-columns: 250px 1fr
</style>
