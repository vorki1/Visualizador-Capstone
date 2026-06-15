// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../instrumentos/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/areas',
    name: 'areas',
    component: () => import('../instrumentos/views/AreasView.vue')
  },
  {
    path: '/treemap',
    name: 'treemap',
    component: () => import('../instrumentos/views/TreemapView.vue')
  },
  {
    path: '/areas/:area',
    name: 'subareas',
    component: () => import('../instrumentos/views/SubareasView.vue')
  },
  {
    path: '/areas/:area/subareas/:subarea',
    name: 'sistemas',
    component: () => import('../instrumentos/views/SistemasView.vue')
  },
  {
    path: '/areas/:area/subareas/:subarea/sistemas/:sistema',
    name: 'instrumentos',
    component: () => import('../instrumentos/views/InstrumentosView.vue')
  },
  {
    path: '/instrumento/:id',
    name: 'detalle-instrumento',
    component: () => import('../instrumentos/views/InformacionInstrumento.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../instrumentos/views/DashboardView.vue')
  },
  {
    path: '/admin',
    name: 'AdminView',
    component: () => import('../instrumentos/views/AdminView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router