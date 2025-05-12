import { createRouter, createWebHistory } from 'vue-router'
import basket from '../views/basket.vue'
import completed from '../views/completed.vue'
import incoming from '../views/incoming.vue'
import someDay from '../views/someDay.vue'
import waiting from '../views/waiting.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'waiting', //home
      component: waiting,
    },
    {
      path: '/someDay',
      name: 'someDay',
      component: someDay,
    },
    {
      path: '/incoming',
      name: 'incoming',
      component: incoming,
    },
    {
      path: '/completed',
      name: 'completed',
      component: completed,
    },
    {
      path: '/basket',
      name: 'basket',
      component: basket,
    },

  ],
})

export default router
