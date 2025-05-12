import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useModalsStore = defineStore("modalStore", () => {
  //state
  const modalDates = ref([])
  //methods
  function getDates(task) {
    modalDates.value.push({
      id: Date.now(),
      title: task.title,
      description: task.description
    })
    console.log(modalDates.value)

  }
  //actions

  return {
    modalDates,
    getDates
  }
})