<template>
  <div class="wrapper">
    <nav class="wrapper__menu">
      <div class="logo">Germen</div>
      <a
        v-for="section in sections"
        :key="`menu-${section.key}`"
        class="wrapper__menu-item"
        @click.prevent="goToSection(section.key)"
      >
        {{ section.title }}
      </a>
    </nav>
    <div class="wrapper__content">
      <h1 class="wrapper__title">{{ getActiveSection?.title }}</h1>
      <button
        v-if="isAddButtonVisible"
        class="wrapper__add-button"
        @click="toggleModal"
      >
        Add Task
      </button>
      <ModalAdd v-if="showModal" @close="toggleModal"  />
      <div class="wrapper__header">
        <SearchTags />
        <br />
        <AddTaskForm />
      </div>
    </div>
    <div class="pomodoro">
      <button
        class="pomodoro__button"
        @click="togglePomodoro"
        :class="{ 'pomodoro__button_open': isPomodoroOpen, 
        'pomodoro__button_active': isRunning }">
        🍅
      </button>
      <PomodoroTimer v-if="isPomodoroOpen" @close="isPomodoroOpen = false"
       @statusOfTheTimer = "handlePomodoroStatus"/>     
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useModalsStore } from "../stores/ModalsDate"
import { storeToRefs } from "pinia"
import { sections } from "../data/sections.js"
import { useActivePageStore } from "../stores/activePage.js"
import ModalAdd from "../views/ModalAdd.vue"
import AddTaskForm from "../views/AddTaskForm.vue"
import SearchTags from "../views/SearchTags.vue"
import PomodoroTimer from "../views/Pomodora.vue" 

const modalsStore = useModalsStore()
const activePageStore = useActivePageStore()
const { activePage } = storeToRefs(activePageStore)
const isRunning = ref(false)
const showModal = ref(false)
const isPomodoroOpen = ref(false)

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

const getActiveSection = computed(() =>
  sections.find((e) => e.key === activePage.value)
)

const isAddButtonVisible = computed(() =>
  sections.find((e) => e.key === activePage.value)?.isShowAddTaskButton
)

onMounted(() => {
  activePageStore.setActivePage(sections[0].key)
})
</script>

<style lang="sass" scoped>
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

  &__menu
    display: flex
    flex-direction: column
    gap: 1rem
    padding: 2rem 1rem
    background-color: #1c1c1c
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2)
    overflow-x: auto

    &-item
      font-size: 18px
      color: #e0e0e0
      text-decoration: none
      padding: 0.75rem 1rem
      border-radius: 10px
      transition: background-color 0.2s ease, transform 0.2s ease
      cursor: pointer
      white-space: nowrap

      &:hover
        background-color: #2a2a2a
        transform: scale(1.05)

  &__content
    padding: 1.5rem
    background: #181818
    overflow-y: auto
    min-width: 0

  &__title
    font-size: 24px
    margin-bottom: 1rem
    max-width: 100%
    overflow-wrap: break-word

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

// === Медиазапросы ===

// 💥 Минимум: экраны до 260px
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
  .wrapper__menu-item
    font-size: 12px
    padding: 0.25rem


@media (min-width: 360px) and (max-width: 699px)
  .wrapper
    grid-template-columns: 120px 1fr

// От 700 до 899
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
v