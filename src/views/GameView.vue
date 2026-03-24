<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import VirtualKeyboard from "../components/VirtualKeyboard.vue";

// para leer el nivel y navegar
const route = useRoute();
const router = useRouter();

// cogemos el nivel desde la url
const level = Number(route.query.level);

// pregunta actual y respuesta correcta
const question = ref(null);
const correctAnswer = ref(null);

// tiempo del juego (60s)
const timeLeft = ref(60);
let timer = null;

// momento en el que aparece cada pregunta
let questionStartTime = 0;

// estadísticas
const attempts = ref(0);
const correct = ref(0);
const incorrect = ref(0);

// guardamos historial de preguntas
const history = ref([]);

// configuración de niveles
const levels = {
  1: { tables: [1, 2, 10], range: [1, 10] },
  2: { tables: [3, 4, 5], range: [1, 10] },
  3: { tables: [6, 7, 8, 9], range: [1, 10] },
  4: { tables: [6, 7, 8], range: [6, 9], extra: [11] },
  5: { tables: [12, 13], range: [1, 10] },
};

// número aleatorio de un array
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// número aleatorio entre min y max
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// genera una nueva pregunta
function generateQuestion() {
  const lvl = levels[level];

  let table;
  let multiplier;

  // nivel 4 (tiene lógica especial)
  if (level === 4) {
    const useExtra = Math.random() < 0.3;

    if (useExtra) {
      table = 11;
      multiplier = randomBetween(1, 10);
    } else {
      table = random(lvl.tables);
      multiplier = randomBetween(lvl.range[0], lvl.range[1]);
    }
  } else {
    table = random(lvl.tables);
    multiplier = randomBetween(lvl.range[0], lvl.range[1]);
  }

  question.value = `${table} x ${multiplier}`;
  correctAnswer.value = table * multiplier;

  // guardamos el tiempo de inicio de la pregunta
  questionStartTime = performance.now();
}

// inicia el contador
function startTimer() {
  timer = setInterval(() => {
    timeLeft.value--;

    // cuando llega a 0 termina el juego
    if (timeLeft.value <= 0) {
      clearInterval(timer);

      // mandamos los resultados
      router.push({
        path: "/results",
        query: {
          attempts: attempts.value,
          correct: correct.value,
          incorrect: incorrect.value,
          history: JSON.stringify(history.value),
        },
      });
    }
  }, 1000);
}

// respuesta del usuario
const userAnswer = ref("");

// cuando el usuario responde
function submitAnswer() {
  // calculamos cuánto tardó
  const timeSpent = performance.now() - questionStartTime;

  const isCorrect = Number(userAnswer.value) === correctAnswer.value;

  attempts.value++;

  if (isCorrect) correct.value++;
  else incorrect.value++;

  // guardamos info de la pregunta
  history.value.push({
    question: question.value,
    correct: isCorrect,
    time: timeSpent,
  });

  // limpiamos y generamos nueva
  userAnswer.value = "";
  generateQuestion();
}

// al cargar la página empieza el juego
onMounted(() => {
  generateQuestion();
  startTimer();
});

// añadir número desde teclado virtual
function handleInput(num) {
  userAnswer.value += num;
}

// borrar último número
function handleDelete() {
  userAnswer.value = userAnswer.value.slice(0, -1);
}
</script>

<template>
  <div class="p-6 max-w-md mx-auto text-center">
    <!-- tiempo -->
    <h1 class="text-xl font-semibold mb-4">Tiempo: {{ timeLeft }}</h1>

    <!-- pregunta -->
    <h2 class="text-3xl font-bold my-6">
      {{ question }}
    </h2>

    <!-- respuesta del usuario -->
    <div class="text-3xl mb-6 bg-gray-100 p-4 rounded">
      {{ userAnswer || "_" }}
    </div>

    <!-- teclado -->
    <VirtualKeyboard
      @input="handleInput"
      @delete="handleDelete"
      @submit="submitAnswer"
    />

    <!-- stats en tiempo real -->
    <div class="mt-6 bg-gray-100 p-4 rounded text-left">
      <p>Intentos: {{ attempts }}</p>
      <p class="text-green-600">Aciertos: {{ correct }}</p>
      <p class="text-red-600">Fallos: {{ incorrect }}</p>
    </div>
  </div>
</template>
