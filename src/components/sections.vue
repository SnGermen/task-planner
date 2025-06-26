<template>
  <div class="wrapper">
    <nav class="wrapper__menu">

      <a
        v-for="section in sections"
        :key="`menu-${section.key}`"
        class="wrapper__menu-item"
        @click.prevent="goToSection(section.key)"
      >
        {{ section.title  }} 
      </a>
      
    </nav>

    <div class="wrapper__content">
      <h1 class="wrapper__title">{{ getActiveSection?.title }}</h1>
      <button
        v-if="isAddButtonVisible"
        class="wrapper__add-button"
        @click="toggleModal"
      >
        Add TasSk
      </button>
      <ModalAdd v-if="showModal" @close="toggleModal" />
      <AddTaskForm />
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

const modalsStore = useModalsStore()
const activePageStore = useActivePageStore() 

const { activePage } = storeToRefs(activePageStore) 

const showModal = ref(false)

function toggleModal() {
  showModal.value = !showModal.value
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

    &-item
      font-size: 18px
      color: #e0e0e0
      text-decoration: none
      padding: 0.75rem 1rem
      border-radius: 10px
      transition: background-color 0.2s ease, transform 0.2s ease
      cursor: pointer

      &:hover
        background-color: #2a2a2a
        transform: scale(1.05)

  &__content
    padding: 1.5rem
    background: #181818
    overflow-y: auto
    scrollbar-width: thin
    scrollbar-color: #f1c40f transparent

    &::-webkit-scrollbar
      width: 8px

    &::-webkit-scrollbar-track
      background: transparent

    &::-webkit-scrollbar-thumb
      background-color: #f1c40f
      border-radius: 4px
      border: 2px solid transparent
      background-clip: content-box

  &__title
    font-size: 24px
    margin-bottom: 1rem

  &__add-button
    background-color: #444
    color: white
    padding: 0.5rem 1rem
    border-radius: 8px
    border: none
    cursor: pointer
    margin-bottom: 1.5rem
    transition: background-color 0.2s ease

    &:hover
      background-color: #666

@media (min-width: 1024px)
  .wrapper__menu
    text-align: left
</style>
