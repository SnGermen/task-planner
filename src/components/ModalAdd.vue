<template>
  <div class="modal">
    <div class="modal_box">
      <header class="modal_box_header">
        <input class="modal_box_title" type="text" placeholder="Title" v-model="title" />
      </header>
      <main class="modal_box_main">
        <textarea class="modal_box_description" placeholder="Description" v-model="description"></textarea>
      </main>
      <footer class="modal_box_footer">
        <button class="modal_box_button modal_box_button--close" @click="$emit('close')">Close</button>
        <button class="modal_box_button modal_box_button--create" @click="submitTask">Create</button>
      </footer>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useModalsStore } from '../stores/ModalsDate'
import { storeToRefs } from 'pinia'

const title = ref('')
const description = ref('')
const modalsStore = useModalsStore()
const emit = defineEmits(['close'])
const { activePage } = storeToRefs(modalsStore)

function submitTask() {
  if (title.value && description.value) {
    modalsStore.addTheDatestoTheStorage({
      title: title.value,
      description: description.value,
      category: activePage.value,
    })
    title.value = ''
    description.value = ''
    emit('close')
  } else {
    console.log('Заполни оба поля')
  }
}
</script>


<style scoped lang="scss">
.modal {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;

  &_box {
    width: 550px;
    background: #1e1e1e;
    border-radius: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);

    &_header,
    &_main,
    &_footer {
      width: 100%;
      display: flex;
      justify-content: center;
    }

    &_title,
    &_description {
      width: 100%;
      max-width: 500px;
      border-radius: 10px;
      padding: 10px;
      font-size: 16px;
      background-color: #2c2c2c;
      color: #fff;
      border: 1px solid #444;
    }

    &_description {
      height: 100px;
      resize: none;
    }

    &_footer {
      justify-content: flex-end;
      gap: 10px;
    }

    &_button {
      padding: 8px 16px;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      font-weight: bold;
      transition: background-color 0.3s, transform 0.2s;
      color: #fff;

      &--close {
        background-color: #444;
        &:hover {
          background-color: #666;
        }
      }

      &--create {
        background-color: #42b983;
        &:hover {
          background-color: #369c6a;
        }
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }
}
</style>
