<template>
  <div
    v-for="project in onlyNewDelatedSections"
    :key="project.key"
    class="project__container"
    :class="{
      'project__trashed': project.category === 'trash'
    }"
  >
    <div class="project__text">
      <div class="project__title">📁 {{ project.title }}</div>
    </div>
    <div class="project__actions">
      <button
        v-if="project.category === 'trash'"
        @click="useProjectStore().restoreProjectT(project.key)"
        class="project__btn project__btn--restore"
      >♻️</button>
      <button
        @click="useProjectStore().removeProject(project.key)"
        class="project__btn project__btn--delete"
      >🗑️</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useActivePageStore } from '../stores/activePage'
import { useProjectStore } from "../stores/ProjectsDate"
import { sections } from "../data/sections"

const activePageStore = useActivePageStore()
const { activePage } = storeToRefs(activePageStore)

const modalConfig = ref(false)
const selectedProject = ref(null)

const onlyNewDelatedSections = computed(() => {
  if (activePage.value !== "trash") return []
  return sections.value.filter(sec => sec.isNew && sec.category === "trash")
})
</script>



<style scoped lang="sass">
.project
  &__container
    display: flex
    justify-content: space-between
    align-items: center
    padding: 1rem
    margin-bottom: 0.75rem
    background-color: #1e1e1e
    border: 1px solid #444
    border-radius: 12px
    transition: background-color 0.2s ease
    overflow: hidden
    gap: 0.75rem
    margin-top: 0.5rem

    &:hover
      background-color: #2a2a2a

  &__text
    flex: 1
    min-width: 0 
    display: flex
    flex-direction: column
    overflow: hidden

  &__title
    font-size: 20px
    color: #fff
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis

  &__actions
    display: flex
    gap: 0.5rem
    flex-shrink: 0

  &__btn
    background: transparent
    border: none
    font-size: 1.25rem
    cursor: pointer
    color: #aaa
    transition: color 0.2s

    &:hover
      color: #fff

  &__btn--resolve
    color: #4cd137

  &__btn--delete
    color: #e74c3c


@media (max-width: 260px)
  .project
    &__container
      flex-direction: column
      align-items: flex-start
    &__title
      font-size: 14px
      white-space: normal
    &__actions
      width: 100%
      justify-content: flex-end

@media (min-width: 360px) and (max-width: 699px)
  .project
    &__title
      font-size: 15px



</style>
