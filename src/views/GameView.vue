<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import VirtualKeyboard from "../components/VirtualKeyboard.vue";

const route = useRoute();
const router = useRouter();

const isFinished = ref(false);
const level = Number(route.query.level) || 1;
const question = ref(null);
const lastQuestion = ref(""); // Para evitar repeticiones
const correctAnswer = ref(null);
const timeLeft = ref(60);
let timer = null;
let questionStartTime = 0;

const attempts = ref(0);
const correct = ref(0);
const incorrect = ref(0);
const history = ref([]);

function generateQuestion() {
  const levels = {
    1: { tables: [1, 2, 10], range: [1, 10] },
    2: { tables: [3, 4, 5], range: [1, 10] },
    3: { tables: [6, 7, 8, 9], range: [1, 10] },
    4: { tables: [6, 7, 8], range: [6, 9], extra: [11] },
    5: { tables: [12, 13], range: [1, 10] },
  };
  
  const lvl = levels[level] || levels[1];
  let table, multiplier, newQuestion;
  
  // UX: Bucle para evitar que salga la misma pregunta dos veces seguidas
  do {
    if (level === 4) {
      const useExtra = Math.random() < 0.3;
      table = useExtra ? 11 : lvl.tables[Math.floor(Math.random() * lvl.tables.length)];
      multiplier = useExtra ? Math.floor(Math.random() * 10) + 1 : Math.floor(Math.random() * (lvl.range[1] - lvl.range[0] + 1)) + lvl.range[0];
    } else {
      table = lvl.tables[Math.floor(Math.random() * lvl.tables.length)];
      multiplier = Math.floor(Math.random() * (lvl.range[1] - lvl.range[0] + 1)) + lvl.range[0];
    }
    newQuestion = `${table} × ${multiplier}`;
  } while (newQuestion === lastQuestion.value);

  question.value = newQuestion;
  lastQuestion.value = newQuestion;
  correctAnswer.value = table * multiplier;
  questionStartTime = performance.now();
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) {
      clearInterval(timer);
      isFinished.value = true;
    }
  }, 1000);
}

const userAnswer = ref("");

function submitAnswer() {
  if (isFinished.value) return;
  const isCorrect = Number(userAnswer.value) === correctAnswer.value;
  attempts.value++;
  if (isCorrect) correct.value++; else incorrect.value++;
  history.value.push({ question: question.value, correct: isCorrect, time: performance.now() - questionStartTime });
  userAnswer.value = "";
  generateQuestion();
}

onMounted(() => { generateQuestion(); startTimer(); });
function handleInput(num) { userAnswer.value += num; }
function handleDelete() { userAnswer.value = userAnswer.value.slice(0, -1); }
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center justify-center italic">
    
    <div v-if="!isFinished" class="w-full max-w-md flex flex-col h-full justify-between italic">
      <div class="w-full flex justify-between items-end border-b border-white/10 pb-4">
        <div class="flex flex-col text-left">
          <span class="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Misión</span>
          <span class="text-2xl font-black italic uppercase leading-none">Nivel {{ level }}</span>
        </div>
        <div class="flex flex-col items-end">
          <span class="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Energía</span>
          <span class="text-4xl font-black font-mono leading-none" :class="timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'">
            {{ timeLeft }}s
          </span>
        </div>
      </div>

      <div class="flex flex-col items-center my-10">
        <div class="w-full bg-gradient-to-b from-slate-900 to-black p-12 rounded-[3rem] border border-white/10 shadow-2xl mb-10 text-center relative overflow-hidden">
          <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <p class="text-indigo-500 text-xs font-black uppercase mb-4 tracking-widest animate-pulse">Resolviendo...</p>
          <h2 class="text-7xl font-black tracking-tighter">{{ question }}</h2>
        </div>

        <div class="w-32 h-20 flex items-center justify-center bg-white/5 rounded-2xl border-2 border-indigo-500/50 mb-10">
          <span class="text-5xl font-black text-indigo-400">{{ userAnswer || "..." }}</span>
        </div>

        <VirtualKeyboard @input="handleInput" @delete="handleDelete" @submit="submitAnswer" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white/5 p-4 rounded-2xl border border-white/5 text-left">
          <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aciertos</p>
          <p class="text-2xl font-black text-green-500 leading-none">{{ correct }}</p>
        </div>
        <div class="bg-white/5 p-4 rounded-2xl border border-white/5 text-right">
          <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fallos</p>
          <p class="text-2xl font-black text-red-500 leading-none">{{ incorrect }}</p>
        </div>
      </div>
    </div>

    <div v-else class="w-full max-w-md animate-in fade-in zoom-in duration-500 italic">
      <div class="text-center mb-8">
        <h1 class="text-5xl font-black uppercase tracking-tighter text-white leading-tight">Misión Finalizada</h1>
        <div class="h-1 w-20 bg-indigo-500 mx-auto mt-2 rounded-full shadow-lg"></div>
      </div>

      <div class="bg-slate-900 rounded-[2.5rem] p-8 border border-white/10 text-center mb-6 shadow-2xl">
        <p class="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-2">Aciertos Logrados</p>
        <p class="text-8xl font-black leading-none mb-4 tracking-tighter">{{ correct }}</p>
        <div class="flex justify-around border-t border-white/5 pt-6 mt-2">
          <div>
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Intentos</p>
            <p class="text-xl font-black">{{ attempts }}</p>
          </div>
          <div>
            <p class="text-[10px] font-bold text-red-500 uppercase tracking-widest">Fallos</p>
            <p class="text-xl font-black text-red-500">{{ incorrect }}</p>
          </div>
        </div>
      </div>

      <div class="max-h-48 overflow-y-auto mb-6 space-y-2 pr-2">
        <div v-for="(item, i) in history" :key="i" class="flex justify-between p-4 bg-white/5 rounded-xl border border-white/5 text-sm">
          <span class="font-bold">{{ item.question }}</span>
          <span :class="item.correct ? 'text-green-500' : 'text-red-500'" class="font-black uppercase">
            {{ item.correct ? 'Correcto' : 'Error' }}
          </span>
        </div>
      </div>

      <RouterLink 
        to="/"
        class="block w-full text-center py-5 bg-indigo-600 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
      >
        Volver a la Base
      </RouterLink>
    </div>

  </div>
</template>