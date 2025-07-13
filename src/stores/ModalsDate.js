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
  function upDateTask(task) {
    const index = modalDates.value.findIndex((i) => i.id === task.id)
    if (index !== -1) {
      modalDates.value[index] = task
      saveTask(task)
    }
  }
  return {
    modalDates,
    initStore,
    addTheDatestoTheStorage,
    loadTasks,
    saveTask,
    upDateTask,
  }
})
