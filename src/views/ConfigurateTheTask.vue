<template>
<div class="config_box">nini
      <header class="config_box_header">
        <input class="config_box_title" type="text" placeholder="Title" v-model="editingTask.title" />
      </header>
      <main class="config_box_main">
        <textarea class="config_boxDescription" placeholder="Description" v-model="editingTask.description"></textarea>
        <input  class="config_boxTag" v-model="editingTask.tags"  placeholder="#"type="text"  >
      </main>
      <footer class="config_box_footer">
        <button class="config_boxButton modal_boxButton__close" @click="$emit('close')">Close</button>
        <button class="config_boxButton modal_boxButton__create" @click="submitTask">Change</button>
      </footer>
    </div>
</template>

<script setup>
import { ref,  } from 'vue'
import { useModalsStore } from '../stores/ModalsDate'
import { storeToRefs } from 'pinia'

const modalsStore = useModalsStore()
const { modalDates } = storeToRefs(modalsStore)
const editingTask = ref(null)

function submitTask(){
  const originTask = modalDates.value.find(task => task.id == editingTask.value.id)
  if(JSON.stringify(originTask) === JSON.stringify(editingTask.value)){
    return
  }
  modalsStore.upDateTask({...editingTask.value})
}
</script>

<style scoped lang="sass">

</style>
