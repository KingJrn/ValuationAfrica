import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Property from '../views/Property.vue'

// Configure routes
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/properties',
    name: 'Properties',
    component: Property,
    meta: { requiresAuth: true }
  }
]

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route guard for authenticated routes
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router