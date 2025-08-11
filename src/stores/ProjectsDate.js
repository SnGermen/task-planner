import { defineStore } from "pinia"
import { sections } from "../data/sections"
import { saveNewProject, updateProject, deleteProject } from "../data/db"
import { ref, computed } from "vue"

export const useProjectStore = defineStore("projectStore", () => {
  const onlyOldSections = computed(() => {
    return sections.value.filter((sec) => !sec.isNew)
  })
  const onlyNewSections = computed(() => {
    return sections.value.filter((sec) => sec.isNew && !sec.isTrashed)
  })

  async function createNewProject() {
    const newProject = {
      title: "New Project",
      key: `project_${Date.now()}`,
      icon: "📁",
      isShowAddTaskButton: true,
      isNew: true,
      isTrashed: false,
      category: "project",
    }
    sections.value.push(newProject)
    await saveNewProject(newProject)
  }

  async function setNameOfTitle(projectKey, newName) {
    const project = sections.value.find((p) => p.key === projectKey)
    if (project) {
      project.title = newName
      await updateProject(projectKey, { title: newName })
    }
  }

  async function removeProject(projectKey) {
    const index = sections.value.findIndex((p) => p.key == projectKey)
    if (index !== -1) {
      sections.value.splice(index, 1)
    }
    await deleteProject(projectKey)
  }

  async function moveProjectToTheTrash(projectKey) {
    const project = sections.value.find((p) => p.key === projectKey)
    if (!project) return
    project.category = "trash"
    project.isTrashed = true
    await updateProject(projectKey, {
      isTrashed: true,
      category: "trash",
    })
    console.log("trashed")
  }

  async function restoreProjectT(projectKey) {
    const project = sections.value.find((p) => p.key === projectKey)
    if (!project || project.category !== "trash") return
    project.category = "project"
    project.isTrashed = false
    await updateProject(projectKey, {
      isTrashed: true,
      category: "project",
    })
  }
  return {
    createNewProject,
    setNameOfTitle,
    removeProject,
    moveProjectToTheTrash,
    restoreProjectT,
    onlyOldSections,
    onlyNewSections,
  }
})
