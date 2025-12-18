import { createRouter, createWebHistory } from 'vue-router'

// Импортируем компоненты ПРАВИЛЬНО
const ParkingManagementView = () => import('@/views/ParkingManagementView.vue')
const BookingView = () => import('@/views/BookingView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'parking-management',
      component: ParkingManagementView
    },
    {
      path: '/booking',
      name: 'booking',
      component: BookingView
    }
  ]
})

export default router