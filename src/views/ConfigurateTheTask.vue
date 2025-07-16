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
          @blur="formatTags"
        />
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
import { ref, watch } from 'vue'
import { useModalsStore } from '../stores/ModalsDate'
import { storeToRefs } from 'pinia'

const props = defineProps({ task: Object })
const emit = defineEmits(['close'])

const modalsStore = useModalsStore()
const { modalDates } = storeToRefs(modalsStore)

const title = ref('')
const description = ref('')
const originTags = ref('')

watch(() => props.task, (t) => {
  if (t) {
    title.value = t.title || ''
    description.value = t.description || ''
    originTags.value = t.tags || ''
  }
}, { immediate: true })

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
  formatTags() // убедимся в правильном формате

  const updatedTask = {
    ...props.task,
    title: title.value,
    description: description.value,
    tags: originTags.value,
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
</style>
