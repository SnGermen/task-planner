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
          v-model="description"/>
        <input
          class="modal_box_tag"
          type="text"
          placeholder="#"
          v-model="originTags"
        />
      <nav class="modal__menu" v-if="task.category !=='done'">
      <a 
        v-for="section in filteredSections"
        :key="`menu_${section.key}`"
        class="modal__menu_item"
        @click.prevent=  changeCategoryOfTask(section.key)
        :class="{active: sectionSelected === section.key}"
        
      >
        {{ section.title }}
      </a>
    </nav>
      </main>
      <footer class="modal_box_footer">
        <button class="modal_box_button modal_box_button--close" @click="$emit('close')">
          Close
        </button>
        <button class="modal_box_button modal_box_button--create" @click="submitTask">
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
const props = defineProps({ task: Object })
const emit = defineEmits(['close'])

const modalsStore = useModalsStore()
const { modalDates } = storeToRefs(modalsStore)
const activePageStore = useActivePageStore()
const { activePage } = storeToRefs(activePageStore)
const title = ref('')
const description = ref('')
const originTags = ref('')
const sectionSelected = ref('')
const filteredSections = computed(()=>{
  return sections.value.filter(section => section.key !== 'trash' && section.key !== 'done' && section.category !== 'trash')
})
watch(() => props.task, (t) => {
  if (t) {
    title.value = t.title || ''
    description.value = t.description || ''
    originTags.value = t.tags || ''
    sectionSelected.value = t.category || activePage.value
  }
}, { immediate: true })

function changeCategoryOfTask(key){
  sectionSelected.value = key

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
  }

  const original = modalDates.value.find(t => t.id === updatedTask.id)
  if (JSON.stringify(original) === JSON.stringify(updatedTask)) {
    emit('close')
    return
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

  &_box 
    width: 550px
    background: #1e1e1e
    border-radius: 20px
    padding: 20px
    display: flex
    flex-direction: column
    gap: 20px
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3)

    &_header
    &_main
      display: flex
      flex-direction: column
      gap: 20px
      
    &_footer 
      display: flex
      justify-content: flex-end
      gap: 10px

    &_title, &_description, &_tag
      width: 100%
      max-width: 500px
      border-radius: 10px
      padding: 10px
      font-size: 16px
      background-color: #2c2c2c
      color: #fff
      border: 1px solid #444
      resize: none

    &_title
      height: 50px

    &_description
      height: 100px

    &_tag
      height: 30px

    &_button 
      padding: 8px 16px
      border-radius: 10px
      border: none
      cursor: pointer
      font-weight: bold
      color: #fff
      transition: background-color 0.3s, transform 0.2s

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

  &__menu
    display: flex
    flex-wrap: wrap
    gap: 10px

    &_item
      padding: 8px 16px
      background-color: #2c2c2c
      border: 1px solid #444
      border-radius: 8px
      color: #ccc
      cursor: pointer
      transition: background-color 0.2s, transform 0.2s

      &:hover
         background-color: #3a3a3a

      &.active
          background-color: #42b983
          color: #fff
          font-weight: bold
          transform: scale(1.05)

</style>
