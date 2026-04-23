<script setup>
import { onMounted, onBeforeUnmount, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMachine } from "@xstate/vue";
import { gameMachine, levels } from "../machines/gameMachine.js";
import VirtualKeyboard from "../components/VirtualKeyboard.vue";

// read the route and navigate
const route = useRoute();
const router = useRouter();

// get the level from URL query (reactive)
const level = computed(() => Number(route.query.level));

// initialize XState machine
const { snapshot, send } = useMachine(gameMachine, {
  input: { level: level.value }
});

// simplify access to context
const context = computed(() => snapshot.value.context);
const isIdle = computed(() => snapshot.value.matches('idle'));
const isPlaying = computed(() => snapshot.value.matches('playing'));
const isGameOver = computed(() => snapshot.value.matches('gameOver'));

// validate level
onMounted(() => {
  console.log("GameView mounted, level:", level.value);
  if (!levels[level.value]) {
    console.error("Invalid level:", level.value);
    router.push({ name: "home" });
    return;
  }
});

// handle key press from virtual keyboard (simple-keyboard)
function onKeyPress(button) {
  if (!isPlaying.value) return;

  if (button === "{bksp}") {
    send({ type: "BACKSPACE" });
  } else if (button === "{enter}") {
    send({ type: "SUBMIT" });
  } else {
    send({ type: "INPUT_NUMBER", value: button });
  }
}

// restart current level
function restartLevel() {
  send({ type: "RESTART" });
}

// start game
function startGame() {
  send({ type: "START" });
}
</script>

<template>
  <div class="p-6 max-w-md mx-auto text-center">
    <!-- Idle state: Start button -->
    <div v-if="isIdle" class="py-20">
      <h1 class="text-3xl font-bold mb-8">{{ $t("game.ready") || '¿Listo?' }}</h1>
      <button
        class="bg-green-500 text-white text-2xl px-8 py-4 rounded-full font-bold hover:bg-green-600 transition-transform hover:scale-105 shadow-xl"
        @click="startGame"
      >
        {{ $t("game.start") || 'START' }}
      </button>
    </div>

    <!-- Playing or Game Over state -->
    <div v-else>
      <!-- timer -->
      <h1 class="text-xl font-semibold mb-4">
        {{ $t("game.time") }}: {{ context.timeLeft }}
      </h1>

      <!-- question -->
      <h2 class="text-3xl font-bold my-6">
        {{ context.question }}
      </h2>

      <!-- user answer -->
      <div class="text-3xl mb-6 bg-gray-100 p-4 rounded min-h-[4rem] flex items-center justify-center">
        {{ context.userAnswer || "_" }}
      </div>

      <!-- simple-keyboard component -->
      <VirtualKeyboard :input="context.userAnswer" @keypress="onKeyPress" />

      <!-- statistics (always visible) -->
      <div class="mt-6 bg-gray-100 p-4 rounded text-center">
        <p>{{ $t("game.attempts") }}: {{ context.attempts }}</p>
        <p class="text-green-600">{{ $t("game.correct") }}: {{ context.correct }}</p>
        <p class="text-red-600">{{ $t("game.incorrect") }}: {{ context.incorrect }}</p>
      </div>

      <!-- results & history (only when game is over) -->
      <div v-if="isGameOver" class="mt-6 bg-gray-100 p-4 rounded text-center">
        <h3 class="mt-2 font-semibold mb-2">{{ $t("game.history") }}</h3>
        <div
          v-for="(item, i) in context.history"
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
  </div>
</template>
