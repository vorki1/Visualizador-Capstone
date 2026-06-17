import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../instrumentos/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { publico: true }
  },
  {
    path: '/areas',
    name: 'areas',
    component: () => import('../instrumentos/views/AreasView.vue'),
    meta: { requiereAuth: true }
  },
  {
    path: '/treemap',
    name: 'treemap',
    component: () => import('../instrumentos/views/TreemapView.vue'),
    meta: { requiereAuth: true }
  },
  {
    path: '/areas/:area',
    name: 'subareas',
    component: () => import('../instrumentos/views/SubareasView.vue'),
    meta: { requiereAuth: true }
  },
  {
    path: '/areas/:area/subareas/:subarea',
    name: 'sistemas',
    component: () => import('../instrumentos/views/SistemasView.vue'),
    meta: { requiereAuth: true }
  },
  {
    path: '/areas/:area/subareas/:subarea/sistemas/:sistema',
    name: 'instrumentos',
    component: () => import('../instrumentos/views/InstrumentosView.vue'),
    meta: { requiereAuth: true }
  },
  {
    path: '/instrumento/:id',
    name: 'detalle-instrumento',
    component: () => import('../instrumentos/views/InformacionInstrumento.vue'),
    meta: { requiereAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../instrumentos/views/DashboardView.vue'),
    meta: { requiereAuth: true }
  },
  {
    path: '/alertas-globales',
    name: 'AlertasGlobales',
    component: () => import('../instrumentos/views/AlertasGlobalesView.vue'),
    meta: { requiereAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminView',
    component: () => import('../instrumentos/views/AdminView.vue'),
    meta: { requiereAuth: true, requiereAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const token = localStorage.getItem('access_token')
  const usuarioStorage = localStorage.getItem('usuario')
  const usuario = usuarioStorage ? JSON.parse(usuarioStorage) : null

  if (to.path === '/' && token) {
    return '/areas'
  }

  if (to.meta.requiereAuth && !token) {
    return '/'
  }

  if (to.meta.requiereAdmin && usuario?.rol !== 'admin') {
    return '/areas'
  }

  return true
})

export default router