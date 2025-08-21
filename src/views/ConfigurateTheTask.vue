<template>
  <div class="modal">
    <div class="modal__box">
      <header class="modal__header">
        <input
          class="modal__title"
          type="text"
          placeholder="Title"
          v-model="title"
        />
      </header>

      <main class="modal__main">
        <textarea
          class="modal__description"
          placeholder="Description"
          v-model="description"
        />
        <input
          class="modal__tag"
          type="text"
          placeholder="#"
          v-model="originTags"
        />
        <input
          v-if="activePage == 'waiting'"
          class="modal__name"
          v-model="originName"
          placeholder="name"
          type="text"
          @keydown.space.prevent="preventSpace"
        >
        <nav class="modal__menu" v-if="task.category !== 'done'">
          <div class="modal__menu_group">
            <div
              v-for="section in filteredSections"
              :key="`menu_${section.key}`"
              class="modal__menu_item"
              @click.prevent="changeCategoryOfTask(section.key)"
              :class="{ 'modal__menu_item--active': sectionSelected === section.key }"
            >
              {{ section.title }}
            </div>
          </div>
          <AddProjectToTheTask v-model:project="projectSelected" />


        </nav>
      </main>

      <footer class="modal__footer">
        <button class="modal__button modal__button_close" @click="$emit('close')">
          Close
        </button>
        <button class="modal__button modal__button_create" @click="submitTask">
          Change
        </button>
      </footer>
    </div>
  </div>
</template>


<script setup>
import { ref, watch, computed} from 'vue'
import { useModalsStore } from '../stores/ModalsDate'
import { storeToRefs } from 'pinia'
import {sections} from "../data/sections.js"
import { useActivePageStore } from "../stores/activePage.js"
import AddProjectToTheTask from "../views/AddProjectToTheTask.vue"
const props = defineProps({ task: Object })
const emit = defineEmits(['close'])

const modalsStore = useModalsStore()
const { modalDates } = storeToRefs(modalsStore)
const activePageStore = useActivePageStore()
const { activePage } = storeToRefs(activePageStore)
const title = ref('')
const description = ref('')
const originTags = ref('')
const originName = ref('')
const names = ref('')
const sectionSelected = ref('')
const projectSelected = ref(null)


const filteredSections = computed(()=>{
  return sections.value.filter(section => section.key !== 'trash' && section.key !== 'done' && section.category !== 'trash' && section.isNew == false)
})
watch(() => props.task, (t) => {
  if (t) {
    title.value = t.title || ''
    description.value = t.description || ''
    originTags.value = t.tags || ''
    sectionSelected.value = t.category || activePage.value
    projectSelected.value = t.projectKey  || null
    names.value = t.name || ''
  }
}, { immediate: true })

function changeCategoryOfTask(key){
  sectionSelected.value = key

}
function preventSpace(event) {
  if (event.code === 'Space') {
    event.preventDefault()
  }
}



function formatTags() {
  originTags.value = originTags.value
    .trim()
    .split(/\s+/)
    .map(tag => {
      const clean = tag.replace(/^#+/, '')
      return clean ? '#' + clean : null
    })
    .filter(Boolean)
    .join(' ')
}

function submitTask() {
  formatTags() 

  const updatedTask = {
    ...props.task,
    title: title.value,
    description: description.value,
    tags: originTags.value,
    category: sectionSelected.value || activePage.value,
    projectKey: projectSelected.value,
    name: originName.value
  }


  modalsStore.upDateTask(updatedTask)
  emit('close')
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

  &__box
    width: 550px
    background: #1e1e1e
    border-radius: 20px
    padding: 20px
    display: flex
    flex-direction: column
    gap: 20px
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3)

  &__header,
  &__main,
  &__footer
    display: flex
    flex-direction: column
    gap: 15px

  &__footer
    flex-direction: row
    justify-content: flex-end

  &__title,
  &__description,
  &__tag
    width: 100%
    border-radius: 10px
    padding: 10px
    font-size: 16px
    background-color: #2c2c2c
    color: #fff
    border: 1px solid #444
    resize: none

  &__title
    height: 50px

  &__description
    height: 100px

  &__tag
    height: 30px
  &__name
    width: 100%
    border-radius: 10px
    padding: 10px
    font-size: 16px
    background-color: #2c2c2c
    color: #fff
    border: 1px solid #444
    height: 30px
    resize: none
    

  &__button
    padding: 8px 16px
    border-radius: 10px
    border: none
    cursor: pointer
    font-weight: bold
    color: #fff
    transition: background-color 0.3s, transform 0.2s

    &_close
      background-color: #444
      &:hover
        background-color: #666

    &_create
      background-color: #42b983
      &:hover
        background-color: #369c6a

    &:active
      transform: scale(0.95)

  &__menu
    display: flex
    flex-direction: column
    gap: 15px
    &_group
      display: flex
      flex-wrap: wrap
      gap: 8px
      margin-top: 10px

    &_item
      max-width: 140px
      padding: 6px 10px
      background-color: #2c2c2c
      border: 1px solid #444
      border-radius: 8px
      color: #ccc
      cursor: pointer
      font-size: 14px
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      transition: background-color 0.2s, transform 0.2s
      &--active
        background-color: #42b983
        color: #fff
        transform: scale(1.05)

</style>
