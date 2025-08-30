<template>
  <div class="modal">
    <div class="modal_box">
      <header class="modal_box_header">
        <input
          class="modal_box_title"
          type="text"
          placeholder="Title"
          v-model="title"
        />
      </header>

      <main class="modal_box_main">
        <textarea
          class="modal_box_description"
          placeholder="Description"
          v-model="description"
        ></textarea>

        <input
          class="modal_box_tag"
          v-model="originTags"
          placeholder="#"
          type="text"
        >
        <input
          v-if="activePage == 'waiting'"
          class="modal_box_name"
          v-model="originName"
          placeholder="name"
          type="text"
          @keydown.space.prevent="preventSpace"
        >

        <div class="modal__projects">
          <div class="modal__projects_title">Change category</div>

          <div class="modal__menu_group">
            <div
              v-for="section in filteredSections"
              :key="`menu_${section.key}`"
              class="modal__menu_item"
              @click.prevent="changeCategoryOfTask(section.key)"
              :class="{'modal__menu_item--newActive': sectionSelected === section.key }"
            >
              {{ section.title }}
            </div>
          </div>
          <AddProjectToTheTask v-model:project="projectSelected" />
        </div>
      </main>

      <footer class="modal_box_footer">
        <button
          class="modal_box_button modal_box_button--close"
          @click="$emit('close')"
        >
          Close
        </button>
        <button
          class="modal_box_button modal_box_button--create"
          @click="submitTask"
        >
          Create
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useModalsStore } from '../stores/ModalsDate'
import { useActivePageStore } from '../stores/activePage'
import { sections } from '../data/sections.js'
import { useProjectStore } from '../stores/ProjectsDate'
import AddProjectToTheTask from "../views/AddProjectToTheTask.vue"


const title = ref('')
const description = ref('')
const originTags = ref('')
const originName = ref('')
const projectSelected = ref(null)
const names = ref([])

const modalsStore = useModalsStore()
const activePageStore = useActivePageStore()
const { activePage } = storeToRefs(activePageStore)
const projectStore = useProjectStore()
const sectionSelected = ref(null)

const filteredSections = computed(() => {
  return sections.value.filter(
    section =>
      section.key !== 'trash' &&
      section.key !== 'done' &&
      section.category !== 'trash' && 
      section.isNew != true
  )
})

function preventSpace(event) {
  if (event.code === 'Space') {
    event.preventDefault()
  }
}


function changeCategoryOfTask(key){
  sectionSelected.value = key

}



function onInput() {
  return originTags.value
    .split(/\s+/)
    .filter(w => w.length > 0)
    .map(w => (w.startsWith('#') ? w : '#' + w))
    .join(' ')
}


const emit = defineEmits(['close'])

function submitTask() {
  if (title.value) {
    modalsStore.addTheDatestoTheStorage({
      title: title.value,
      description: description.value,
      category: sectionSelected.value || activePage.value,
      tags: onInput(),
      name: originName.value,
      projectKey: projectSelected.value || sections.value.find(sec => sec.key === activePage.value && sec.isNew)?.key || null,
    })
    title.value = ''
    description.value = ''
    projectSelected.value = null
    sectionSelected.value = null
    names.value = ''
    originTags.value = ''
  } else {
    console.log('Заполни оба поля')
  }
}
</script>

<style scoped lang="sass">
.modal 
  position: fixed
  inset: 0
  display: flex
  justify-content: center
  align-items: center
  background: rgba(0, 0, 0, 0.6)
  z-index: 1000

  &_box 
    width: 550px
    background: #1e1e1e
    border-radius: 20px
    padding: 20px
    display: flex
    flex-direction: column
    justify-content: space-between
    gap: 20px
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3)

    &_header
    &_main
      display: flex
      flex-direction: column
      gap: 20px
      
    &_footer 
      width: 100%
      display: flex
      justify-content: center

    &_title
      width: 100%
      max-width: 500px
      border-radius: 10px
      padding: 10px
      font-size: 16px
      background-color: #2c2c2c
      color: #fff
      border: 1px solid #444
      height: 50px
      resize: none

    &_description
      width: 100%
      max-width: 500px
      border-radius: 10px
      padding: 10px
      font-size: 16px
      background-color: #2c2c2c
      color: #fff
      border: 1px solid #444
      height: 100px
      resize: none

    &_tag
      width: 100%
      max-width: 500px
      border-radius: 10px
      padding: 10px
      font-size: 16px
      background-color: #2c2c2c
      color: #fff
      border: 1px solid #444
      height: 30px
      resize: none
    &_name
      width: 100%
      max-width: 500px
      border-radius: 10px
      padding: 10px
      font-size: 16px
      background-color: #2c2c2c
      color: #fff
      border: 1px solid #444
      height: 30px
      resize: none

    &_footer 
      justify-content: flex-end
      gap: 10px

    &_button 
      padding: 8px 16px
      border-radius: 10px
      border: none
      cursor: pointer
      font-weight: bold
      transition: background-color 0.3s, transform 0.2s
      color: #fff

      &--close 
        background-color: #444
        &:hover 
          background-color: #666

      &--create 
        background-color: #42b983
        &:hover 
          background-color: #369c6a

      &:active 
        transform: scale(0.95)

  &__projects
    display: flex
    flex-direction: column
    gap: 10px
    &:hover
      color: #1abc9c

    &_title
      font-weight: bold
      color: #ccc
      font-size: 14px

  &__menu_group
    display: flex
    flex-wrap: wrap
    gap: 8px

  &__menu_item
    padding: 6px 12px
    background: #444
    border-radius: 10px
    cursor: pointer
    color: #ddd
    user-select: none
    transition: background-color 0.3s


    &--newActive
      background-color: #369c6a
      color: white
</style>
