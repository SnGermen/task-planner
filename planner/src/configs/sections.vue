<template>
  <div class="wrapper">
    <nav class="choose">
      <a href="#/" class="choose_text" @click.prevent="navigate('/')">Waitting</a>
      <a href="#/someDay" class="choose_text" @click.prevent="navigate('/someDay')">SomeDay</a>
      <a href="#/inbox" class="choose_text" @click.prevent="navigate('/inbox')">Inbox</a>
      <a href="#/completed" class="choose_text" @click.prevent="navigate('/completed')">Completed</a>
      <a href="#/basket" class="choose_text" @click.prevent="navigate('/basket')">Basket</a>
    </nav>

    <div class="main_content">
      <component :is="ourComponent" />
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from "vue"
import { useModalsStore } from '../stores/ModalsDate'
import basket from '../views/basket.vue'
import completed from '../views/completed.vue'
import inbox from '../views/inbox.vue'
import someDay from '../views/someDay.vue'
import waitting from '../views/waitting.vue'

const modalsStore = useModalsStore()
const refs = {
  "/": waitting,
  "/someDay": someDay,
  "/inbox": inbox,
  "/completed": completed,
  "/basket": basket
}

const getRef = ref(window.location.hash.slice(1) || "/")

function navigate(path) {
  getRef.value = path
  window.location.hash = path
}

const ourComponent = computed(() => {
  return refs[getRef.value] || waitting
})


onMounted(()=>{
  modalsStore.setActivePage(ourComponent.value)
  window.addEventListener("hashchange", ()=>{
    const newpath = window.location.hash.slice(1)
    getRef.value = newpath
    modalsStore.setActivePage(refs[newpath] || waitting)
})
})
</script>
<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: 300px auto;
  width: 100%;
  height: 100vh;
  background: #121212;
  color: #e0e0e0;
}

.main_content {
  padding: 1.5rem;
  background: #181818;
  overflow-y: auto;
}

.choose {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem 1rem;
  background-color: #1c1c1c;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
}

.choose_text {
  font-size: 18px;
  color: #e0e0e0;
  text-decoration: none;
  text-align: left;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  transition: all 0.2s ease;
  background-color: transparent;
  cursor: pointer;
}

.choose_text:hover {
  background-color: #2a2a2a;
  transform: scale(1.05);
}


@media (min-width: 1024px) {
  .choose {
    text-align: left;
  }
}
</style>
