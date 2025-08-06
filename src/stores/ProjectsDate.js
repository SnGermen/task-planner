import { defineStore } from "pinia"
import { sections } from "../data/sections"
import { saveNewProject, updateProject, deleteProject } from "../data/db"

export const useProjectStore = defineStore("projectStore", () => {
  async function createNewProject() {
    const newProject = {
      title: "New Project",
      key: `project_${Date.now()}`,
      icon: "📁",
      isShowAddTaskButton: true,
      isNew: true,
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

  return {
    createNewProject,
    setNameOfTitle,
    removeProject,
  }
})
