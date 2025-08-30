<template>
  <div class="modal__projects">
    <div class="modal__projects_title">Add Project to the task</div>
    <div class="modal__menu_group">
      <div
        v-for="section in filteredNewSections"
        :key="`menu_${section.key}`"
        class="modal__menu_item"
        @click="selectProject(section.key)"
        :class="{'modal__menu_item--newActive': project === section.key }"
      >
        {{ section.title }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { sections } from "../data/sections.js"

const project = defineModel('project', { type: String, default: null })

const filteredNewSections = computed(() => {
  return sections.value.filter(section =>
    section.key !== 'trash' &&
    section.key !== 'done' &&
    section.category !== 'trash' &&
    section.isNew === true
  )
})

function selectProject(key) {
  if(project.value ===key){
    project.value = null
    return
  }
  project.value = key   
}
</script>

<style scoped lang="sass">
.modal__projects
  border-top: 1px solid #444
  padding-top: 10px

  &_title
    font-size: 14px
    font-weight: bold
    color: #aaa

.modal__menu_group
  display: flex
  flex-wrap: wrap
  gap: 8px
  margin-top: 10px

.modal__menu_item
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

  &--newActive
    background-color: #f39c12
    color: #fff
    transform: scale(1.05)
</style>
