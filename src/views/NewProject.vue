<template>
<button class="create" @click="createNewProject">+ New Project</button>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useModalsStore } from '../stores/ModalsDate'
import { sections } from "../data/sections"
import {saveNewProject, loadProjects} from '../data/db'
import { useProjectStore } from "../stores/ProjectsDate"
import { storeToRefs } from "pinia"

const projectStore = useProjectStore()
const {createNewProject} = projectStore
const modalsStore = useModalsStore()


onMounted(async()=>{
  const projects = await loadProjects()
  sections.value.push(...projects)
})
</script>

<style scoped lang="sass">
.create
  max-width: 200px
  padding: 6px 12px
  border-radius: 8px
  border: 1px solid #555
  background-color: #2c2c2c
  color: #eee
  font-size: 16px
</style>