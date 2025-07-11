<template>
  <input
    type="text"
    v-model="valueOfInput"
    placeholder="#"
    class="search-input"
  />
</template>

<script setup>
import { ref, computed, watch } from "vue"
import {storeOfTags} from "../stores/SearchTags.js"

const valueOfInput = ref("")
const tagsStore = storeOfTags()

watch(valueOfInput, (newTag)=>{
  tagsStore.setTags(newTag)
})
</script>

<style scoped lang="sass">
.search-input
  display: flex
  width: 250px
  padding: 6px 12px
  border-radius: 8px
  border: 1px solid #555
  background-color: #2c2c2c
  color: #eee
  font-size: 16px
  outline: none
  transition: border-color 0.3s ease

  &:focus
    border-color: #f1c40f
    background-color: #1e1e1e
</style>
