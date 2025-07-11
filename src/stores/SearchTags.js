import { ref } from "vue"
import { defineStore } from "pinia"

export const storeOfTags = defineStore("tagsStore", () => {
  const saveTags = ref("")

  function setTags(tag) {
    saveTags.value = tag
    console.log("saved tag:", saveTags.value)
  }

  return {
    saveTags,
    setTags,
  }
})
