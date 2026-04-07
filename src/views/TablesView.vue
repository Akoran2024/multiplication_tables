<template>
  <div class="min-h-screen bg-slate-50 p-6 italic">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-10">
        <h1 class="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">
          Base de <span class="text-indigo-600">Datos</span>
        </h1>
        <p class="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Protocolos de multiplicación</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 13" :key="n" class="bg-white border-2 border-slate-200 p-6 rounded-[2rem] shadow-sm hover:border-indigo-400 transition-colors">
          <h2 class="font-black text-2xl mb-4 text-slate-800 uppercase italic border-b-2 border-slate-100 pb-2">
            Tabla del <span class="text-indigo-600">{{ n }}</span>
          </h2>
          <div class="space-y-1">
            <div v-for="i in 10" :key="i" class="flex justify-between font-mono text-slate-600 border-b border-slate-50 py-1 hover:bg-slate-50">
              <span>{{ n }} x {{ i }}</span>
              <span class="font-black text-slate-900">= {{ n * i }}</span>
            </div>
          </div>
        </div>
      </div>

      <RouterLink 
        to="/" 
        class="fixed bottom-8 right-8 bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:bg-indigo-600 transition-all active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </RouterLink>
    </div>
  </div>
</template>