<template>
  <input
    type="text"
    v-model="valueOfInput"
    placeholder="#"
    class="search_input"
  />
</template>

<script setup>
import { ref, computed, watch } from "vue"
import {storeOfTags} from "../stores/SearchTagsOrName.js"


const valueOfInput = ref("")
const tagsStore = storeOfTags()


watch(valueOfInput, (newTag)=>{
  tagsStore.setTags(newTag)
})
</script>

<style scoped lang="sass">
.search_input
  display: flex
  width: 300px
  padding: 6px 12px
  border-radius: 8px
  border: 1px solid #555
  background-color: #2c2c2c
  color: #eee
  font-size: 16px
  outline: none
  transition: border-color 0.3s ease
  margin-top: 10px

  &:focus
    border-color: #f1c40f
    background-color: #1e1e1e
    
@media(max-width: 700px)
  .search_input
    width: 200px
</style>
