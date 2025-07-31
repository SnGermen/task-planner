import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { saveNewProject } from "../data/db"
import { sections } from "../data/sections"

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

  return {
    createNewProject,
  }
})
