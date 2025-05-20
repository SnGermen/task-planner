
<template>
    <div class="wrapper">
      <nav class="choose">
        <RouterLink class="choose_text" to="/">Waitting</RouterLink>
        <RouterLink class="choose_text" to="/someDay">Some Day</RouterLink>
        <RouterLink class="choose_text" to="/incoming">Incoming</RouterLink>
        <RouterLink class="choose_text" to="/completed">Completed</RouterLink>
        <RouterLink class="choose_text" to="/basket">Basket</RouterLink>
      </nav>
      <div class="main_content">
        <RouterView />
      </div>
    </div>
    
</template>

<script setup>
import { RouterLink, RouterView, useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useModalsStore } from './stores/ModalsDate'

const route = useRoute()
const modalsStore = useModalsStore()

modalsStore.setActivePage(route.name)
onBeforeRouteUpdate(to=>{
  modalsStore.setActivePage(to.name)
})
// Я не могу это использовать onBeforeRouteUpdate в корневом элементе
</script>



<style scoped>
.wrapper {
 display: grid;
 grid-template-columns: 300px auto;
 width: 100%;
 height: 100vh;
}

.main_content{
  background: radial-gradient(black, transparent);
}

.choose {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.choose_text{
  font-size: 18px;
}

.choose_text.router-link-exact-active{
  color: var(--color-text);
  font-size: 20px;
}
.choose_text.router-link-exact-active:hover {
  background-color: transparent;
 
}

.choose_text {
  display: inline-block;
  text-align: center;
}

.choose_text:first-of-type {
  border: 0;
}


@media (min-width: 1024px) {


  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .choose {
    text-align: left;
    font-size: 1rem;
    /* padding: 1rem 0;
    margin-top: 1rem; */
  }
}
</style>
