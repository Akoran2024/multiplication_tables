import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TablesView from '../views/TablesView.vue'
import GameView from '../views/GameView.vue'

const routes = [
  { 
    path: '/', 
    name: 'home', 
    component: HomeView 
  },
  { 
    path: '/tables', 
    name: 'tables', 
    component: TablesView 
  },
  { 
    path: '/game/:level', // Usamos parámetro dinámico en lugar de query
    name: 'game', 
    component: GameView,
    props: true, // Pasamos el nivel como prop automáticamente
    beforeEnter: (to, from, next) => {
      const level = parseInt(to.params.level)
      // Validación: Si no es un número del 1 al 5, abortamos o redirigimos
      if (isNaN(level) || level < 1 || level > 5) {
        next({ name: 'home' }) 
      } else {
        next()
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router