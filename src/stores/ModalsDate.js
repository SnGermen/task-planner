import { ref } from "vue"
import { defineStore } from "pinia"
import { loadTasks, saveTask, deleteTask } from "../data/db"

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
      name: task.name || "",
      projectKey: task.projectKey || null,
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
  async function clearAllTasksInTheTrash() {
    const tasksInTheTrash = modalDates.value.filter(
      (t) => t.category == "trash"
    )

    for (const task of tasksInTheTrash) {
      modalDates.value = modalDates.value.filter((t) => t.id !== task.id)
      await deleteTask(task.id)
    }
  }

  return {
    modalDates,
    initStore,
    addTheDatestoTheStorage,
    loadTasks,
    saveTask,
    upDateTask,
    clearAllTasksInTheTrash,
  }
})
