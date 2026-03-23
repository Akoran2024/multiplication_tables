import { createRouter, createWebHistory } from 'vue-router'

// Vistas
import HomeView from '../views/HomeView.vue'
import TablesView from '../views/TablesView.vue'
import GameView from '../views/GameView.vue'
import ResultsView from '../views/ResultsView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/tables', component: TablesView },
  { path: '/game', component: GameView },
  { path: '/results', component: ResultsView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router