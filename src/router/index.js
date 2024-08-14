import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/manageVote',
      name: 'manageVote',
      component: () => import('../views/後台/ManageVote.vue')
    },
    {
      path: '/userPage',
      name: 'userPage',
      component: () => import('../views/前台/UserPage.vue')
    }
  ]
})

export default router
