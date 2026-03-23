<script setup>
import { useRouter } from 'vue-router'

// usamos el router para movernos entre páginas
const router = useRouter()

// cuando el usuario elige nivel lo mandamos al juego
function selectLevel(level) {
  router.push({ path: '/game', query: { level } })
}
</script>

<template>
  <div class="p-6 max-w-md mx-auto text-center">
    <!-- título -->
    <h1 class="text-3xl font-bold mb-6">Selecciona nivel</h1>

    <!-- descripción del juego -->
    <p class="mb-6 text-gray-700">
      Elige un nivel y practica las tablas de multiplicar. 
      Tienes 60 segundos para responder tantas preguntas como puedas. 
      ¡Intenta acertar el máximo posible!
    </p>

    <!-- botones de niveles -->
    <div class="flex flex-col gap-3">
      <button 
        class="bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
        @click="selectLevel(1)">
        Nivel 1
      </button>

      <button 
        class="bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
        @click="selectLevel(2)">
        Nivel 2
      </button>

      <button 
        class="bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
        @click="selectLevel(3)">
        Nivel 3
      </button>

      <button 
        class="bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
        @click="selectLevel(4)">
        Nivel 4
      </button>

      <button 
        class="bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
        @click="selectLevel(5)">
        Nivel 5
      </button>
    </div>
  </div>
</template>