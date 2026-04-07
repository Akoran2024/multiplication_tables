<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function selectLevel(level) {
  router.push({ path: '/game', query: { level } })
}
</script>

<script setup>
// No necesitamos selectLevel porque usamos :to en RouterLink
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 italic">
    <div class="max-w-md w-full text-center">
      <h1 class="text-5xl font-black mb-2 text-slate-900 tracking-tighter uppercase italic">
        Multi<span class="text-indigo-600">Master</span>
      </h1>
      <p class="text-slate-500 font-medium mb-10 italic">Selecciona tu desafío</p>

      <div class="grid grid-cols-1 gap-4">
        <RouterLink 
          v-for="n in 5" :key="n"
          :to="{ path: '/game', query: { level: n } }"
          class="group relative block overflow-hidden bg-white border-2 border-slate-200 p-5 rounded-2xl transition-all duration-200 hover:border-indigo-500 hover:-translate-y-1 active:scale-95 shadow-sm hover:shadow-xl hover:shadow-indigo-100"
        >
          <div class="flex justify-between items-center relative z-10">
            <span class="text-2xl font-black text-slate-800 uppercase">NIVEL {{ n }}</span>
            <span class="bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white px-3 py-1 rounded-lg text-sm font-bold transition-colors uppercase">
              JUGAR
            </span>
          </div>
          <div class="absolute -right-4 -bottom-4 text-6xl opacity-5 font-black group-hover:opacity-10 transition-opacity">
            {{ n }}
          </div>
        </RouterLink>
      </div>

      <p class="mt-8 text-xs text-slate-400 font-bold uppercase tracking-widest">
        60 segundos por partida
      </p>
    </div>
  </div>
</template>