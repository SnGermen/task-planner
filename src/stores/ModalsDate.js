import { ref } from "vue"
import { defineStore } from "pinia"
import { loadTasks, saveTask } from "../data/db"

export const useModalsStore = defineStore("modalStore", () => {
  const modalDates = ref([])

  async function initStore() {
    const tasksFromDB = await loadTasks()
    modalDates.value = tasksFromDB
  }

  async function addTheDatestoTheStorage(task) {
    const newTask = {
      id: Date.now(),
      title: task.title,
      description: task.description,
      category: task.category,
      isTrashed: false,
      isDone: false,
      tags: task.tags,
    }
    await saveTask(newTask)
    modalDates.value.push(newTask)
    console.log("Добавлена задача:", newTask)
  }

  return {
    modalDates,
    initStore,
    addTheDatestoTheStorage,
    loadTasks,
    saveTask,
  }
})
