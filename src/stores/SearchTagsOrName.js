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

export const storeOfName = defineStore("nameStore", () => {
  const saveName = ref("")

  function setName(name) {
    saveName.value = name
    console.log("saved name:", saveName.value)
  }

  return {
    saveName,
    setName,
  }
})
