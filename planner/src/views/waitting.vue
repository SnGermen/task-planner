<template>
  <div>
    <button @click="toggleModal">Add Task</button>
    <Modal v-if="showModal" @close="toggleModal" />
    <AddTask/>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Modal from '../components/ModalAdd.vue'
import AddTask from '../components/AddTaskForm.vue'


const showModal = ref(false)

function toggleModal() {
  showModal.value = !showModal.value
}
</script>

<style scoped>
</style>