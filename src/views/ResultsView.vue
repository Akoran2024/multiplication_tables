<script setup>
import { useRoute, useRouter } from "vue-router";

// router para volver al inicio
const router = useRouter();

// usamos route para leer los datos que vienen del juego
const route = useRoute();

// stats principales
const attempts = route.query.attempts;
const correct = route.query.correct;
const incorrect = route.query.incorrect;

// historial de preguntas (viene como string desde la URL, lo parseamos)
const historyData = route.query.history ? JSON.parse(route.query.history) : [];
</script>

<template>
  <div class="p-6 max-w-md mx-auto text-center">
    <!-- título -->
    <h1 class="text-3xl font-bold mb-6">Resultados</h1>

    <!-- stats principales -->
    <div class="bg-gray-100 p-4 rounded mb-6">
      <p>Intentos: {{ attempts }}</p>
      <p class="text-green-600">Aciertos: {{ correct }}</p>
      <p class="text-red-600">Fallos: {{ incorrect }}</p>
    </div>

    <!-- historial -->
    <h2 class="text-xl mb-3">Historial</h2>

    <div v-for="(item, i) in historyData" :key="i" class="text-sm mb-1">
      {{ item.question }} - {{ item.correct ? "✔️" : "❌" }} -
      {{ (item.time / 1000).toFixed(2) }}s
    </div>

    <!-- botón volver -->
    <button
      class="mt-6 bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
      @click="router.push('/')"
    >
      Volver
    </button>
  </div>
</template>
