// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'
import EjemploUnoView from '../instrumentos/views/ejemploUnoView.vue'

const routes = [
  {
    path: '/ejemplo',
    name: 'ejemplo',
    component: EjemploUnoView
  },
  {
    path: '/',
    name: 'home',
    component: App
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router