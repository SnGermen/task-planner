// stores/ModalsDate.js
import { computed, reactive, ref } from 'vue';
import { defineStore } from 'pinia';

export const useModalsStore = defineStore('modalStore', () => {

  const modalDates = ref([]);
  const activePage = ref("")

  function setActivePage(page) {
    activePage.value = page
  }
  function addTheDatestoTheStorage(task) {
    modalDates.value.push({
      id: Date.now(),
      title: task.title,
      description: task.description,
      category: task.category

    });
    console.log('Current Tasks:', modalDates)
  }


  return {
    activePage,
    modalDates,
    setActivePage,
    addTheDatestoTheStorage,

  };
});
