// stores/ModalsDate.js
import { computed, reactive, ref } from 'vue';
import { defineStore } from 'pinia';

export const useModalsStore = defineStore('modalStore', () => {
  const activePage = ref("waitting")

  const modalDates = reactive({
    waitting: [],
    completed: [],
    incoming: [],
    someDay: [],
  });
  function setActivePage(page) {
    activePage.value = page
  }

  function addTheDatestoTheStorage(task) {
    modalDates[activePage.value].push({
      id: Date.now(),
      title: task.title,
      description: task.description,
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
