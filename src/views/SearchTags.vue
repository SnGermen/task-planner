<template>
  <input
    type="text"
    v-model="findeTags"
    @input="getDates"
    placeholder="Поиск по тегам..."
    class="search-input"
  />
</template>

<script setup>
import { ref } from "vue"
const findeTags = ref("")
const emit = defineEmits(["sendTags"])

function getDates() {
  emit("sendTags", findeTags.value)
}
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
