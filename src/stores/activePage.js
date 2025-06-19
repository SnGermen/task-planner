import { ref } from "vue"
import { defineStore } from "pinia"

export const useActivePageStore = defineStore("activePageStore", () => {
  const activePage = ref("")

  function setActivePage(page) {
    activePage.value = page
  }

  return {
    activePage,
    setActivePage,
  }
})
