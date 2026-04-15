import { createRouter, createWebHistory } from "vue-router";

// views
import HomeView from "../views/HomeView.vue";
import TablesView from "../views/TablesView.vue";
import GameView from "../views/GameView.vue";

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/tables", name: "tables", component: TablesView },
  { path: "/game", name: "game", component: GameView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
