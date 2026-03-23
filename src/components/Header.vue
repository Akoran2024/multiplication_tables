<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// para saber qué sección está activa
function isActive(path) {
  return route.path === path
}
</script>

<template>
  <header class="bg-blue-500 text-white p-4 flex justify-center gap-6 shadow-md">
    <button 
      class="hover:underline font-semibold" 
      :class="{ 'underline': isActive('/') }"
      @click="router.push('/')"
    >
      Inicio
    </button>

    <button 
      class="hover:underline font-semibold" 
      :class="{ 'underline': isActive('/tables') }"
      @click="router.push('/tables')"
    >
      Tablas
    </button>
  </header>
</template>