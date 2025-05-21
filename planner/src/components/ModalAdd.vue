<template>
  <div class="modal">
    <div class="modal_wrapper">
      <header class="modal_header">
        <input class="modal_title" type="text" placeholder="Title" v-model="title">
      </header>
      <main class="modal_main">
        <textarea class="modal_description" placeholder="Description" v-model="description"></textarea>
      </main>
      <footer class="modal_footer">
        <button class="modal_button" @click="$emit('close')">Close</button> 
        <!-- Нужно понять как работает  emit.. это реально гениально -->
        <button class="modal_button" @click="submitTask">Create</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useModalsStore } from '../stores/ModalsDate'

const title = ref('')
const description = ref('')
const modalsStore = useModalsStore()
const emit = defineEmits(['close'])

function submitTask() {
  if (title.value && description.value) {
    modalsStore.addTheDatestoTheStorage({
      title: title.value,
      description: description.value
    })
    title.value = ''
    description.value = ''
    emit('close')
  } else {
    console.log("Заполни оба поля")
  }
}
</script>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
.modal_wrapper {
  width: 550px;
  height: 350px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 25px;
  background: gray;
  align-items: center;
  padding: 5px;
  justify-content: space-evenly;
}
.modal_header {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
}
.modal_title {
  max-width: 500px;
  height: 5vh;
  width: 100%;
  border-radius: 10px;
  font-size: 20px;
}
.modal_main {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
}
.modal_description {
  max-width: 500px;
  height: 15vh;
  width: 100%;
  border-radius: 10px;
  resize: none;
  font-size: 15px;
}
.modal_footer {
  display: flex;
  justify-content: end;
  width: 100%;
  gap: 15px;
  max-width: 500px;
}
.modal_button {
  width: 90px;
  height: 30px;
  border-radius: 10px;
}
</style>
