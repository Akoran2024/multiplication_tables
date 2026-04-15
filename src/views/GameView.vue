<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import VirtualKeyboard from "../components/VirtualKeyboard.vue";

// read the route and navigate
const route = useRoute();
const router = useRouter();

// get the level from URL query (reactive)
const level = computed(() => Number(route.query.level));

// current question and correct answer
const question = ref(null);
const correctAnswer = ref(null);

// game timer (seconds)
const timeLeft = ref(60);
let timer = null;

// start time of current question
let questionStartTime = 0;

// last question to avoid repetition
let lastQuestion = "";

// game statistics
const attempts = ref(0);
const correct = ref(0);
const incorrect = ref(0);

// history of questions with correctness and time spent
const history = ref([]);

// pool of questions for the current level
const questionsPool = ref([]);

// game over state
const gameOver = ref(false);

// user input answer
const userAnswer = ref("");

// level configurations
const levels = {
  1: { tables: [1, 2, 10], range: [1, 10] },
  2: { tables: [3, 4, 5], range: [1, 10] },
  3: { tables: [6, 7, 8, 9], range: [1, 10] },
  4: { tables: [6, 7, 8, 11], range: [1, 10] },
  5: { tables: [12, 13], range: [1, 10] },
};

// validate level and start game
onMounted(() => {
  console.log("GameView mounted, level:", level.value);
  if (!levels[level.value]) {
    console.error("Invalid level:", level.value);
    router.push({ name: "home" });
    return;
  }

  // generate first question
  generateQuestion();
  console.log("First question generated:", question.value);

  // start game timer
  startTimer();
});

function initializePool() {
  const lvl = levels[level.value];
  const pool = [];

  lvl.tables.forEach((table) => {
    for (let i = lvl.range[0]; i <= lvl.range[1]; i++) {
      pool.push({ table, multiplier: i });
    }
  });

  // Shuffle pool (Fisher-Yates)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // avoid repeating last question from previous pool
  if (
    pool.length > 1 &&
    `${pool[0].table} x ${pool[0].multiplier}` === lastQuestion
  ) {
    const first = pool.shift();
    pool.push(first);
  }

  questionsPool.value = pool;
}

function generateQuestion() {
  if (questionsPool.value.length === 0) {
    initializePool();
  }

  const { table, multiplier } = questionsPool.value.shift();
  const newQuestion = `${table} x ${multiplier}`;

  question.value = newQuestion;
  correctAnswer.value = table * multiplier;
  lastQuestion = newQuestion;

  // save start time for timing
  questionStartTime = performance.now();
}

// start the countdown timer
function startTimer() {
  timer = setInterval(() => {
    timeLeft.value--;

    if (timeLeft.value <= 0) {
      clearInterval(timer);
      gameOver.value = true;
    }
  }, 1000);
}

// handle answer submission
function submitAnswer() {
  if (gameOver.value) return; // cannot answer after game over

  const timeSpent = performance.now() - questionStartTime;
  const isCorrect = Number(userAnswer.value) === correctAnswer.value;

  attempts.value++;
  if (isCorrect) correct.value++;
  else incorrect.value++;

  history.value.push({
    question: question.value,
    correct: isCorrect,
    time: timeSpent,
  });

  userAnswer.value = "";
  generateQuestion();
}

// virtual keyboard input handler (simple-keyboard)
function handleInput(num) {
  if (!gameOver.value) {
    userAnswer.value += num;
  }
}

// delete last character
function handleDelete() {
  if (!gameOver.value) {
    userAnswer.value = userAnswer.value.slice(0, -1);
  }
}

// handle key press from simple-keyboard
function onKeyPress(button) {
  if (button === "{bksp}") {
    handleDelete();
  } else if (button === "{enter}") {
    submitAnswer();
  } else {
    handleInput(button);
  }
}

// restart current level
function restartLevel() {
  timeLeft.value = 60;
  attempts.value = 0;
  correct.value = 0;
  incorrect.value = 0;
  history.value = [];
  questionsPool.value = [];
  gameOver.value = false;

  userAnswer.value = "";

  generateQuestion();
  startTimer();
}
</script>

<template>
  <div class="p-6 max-w-md mx-auto text-center">
    <!-- timer -->
    <h1 class="text-xl font-semibold mb-4">
      {{ $t("game.time") }}: {{ timeLeft }}
    </h1>

    <!-- question -->
    <h2 class="text-3xl font-bold my-6">
      {{ question }}
    </h2>

    <!-- user answer -->
    <div class="text-3xl mb-6 bg-gray-100 p-4 rounded">
      {{ userAnswer || "_" }}
    </div>

    <!-- simple-keyboard component -->
    <VirtualKeyboard :input="userAnswer" @keypress="onKeyPress" />

    <!-- statistics (always visible) -->
    <div class="mt-6 bg-gray-100 p-4 rounded text-center">
      <p>{{ $t("game.attempts") }}: {{ attempts }}</p>
      <p class="text-green-600">{{ $t("game.correct") }}: {{ correct }}</p>
      <p class="text-red-600">{{ $t("game.incorrect") }}: {{ incorrect }}</p>
    </div>

    <!-- results & history (only when game is over) -->
    <div v-if="gameOver" class="mt-6 bg-gray-100 p-4 rounded text-center">
      <h3 class="mt-2 font-semibold mb-2">{{ $t("game.history") }}</h3>
      <div
        v-for="(item, i) in history"
        :key="i"
        class="text-sm mb-1 flex justify-center items-center gap-2"
      >
        <span>{{ item.question }}</span>
        <span>{{ item.correct ? "✔️" : "❌" }}</span>
        <span>{{ (item.time / 1000).toFixed(2) }} s</span>
      </div>
    </div>

    <!-- buttons -->
    <div class="flex justify-center mt-4 gap-x-4">
      <button
        class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        @click="restartLevel"
      >
        {{ $t("game.restart") }}
      </button>

      <RouterLink
        :to="{ name: 'home' }"
        class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        {{ $t("game.home") }}
      </RouterLink>
    </div>
  </div>
</template>
