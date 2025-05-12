<template>
  <div class="task">
    <input type='checkbox'>
    <div class="title">{{ title }}</div>
  </div>
</template>
<script>
import useModalsStore from "../stores/ModalsDate"
export default{
  name: "ModalAdd",
  setup(){
    const modalsStore = useModalsStore()
    const title = modalsStore.title
    const description = modalsStore.description
    return{modalsStore,title,description}
  }

}
</script>
<style scoped>

</style>