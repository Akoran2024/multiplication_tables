<script setup>
import { onMounted, onBeforeUnmount, watch } from "vue";
import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";

const props = defineProps({
  input: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["keypress"]);

let keyboard = null;

// handle physical keyboard input
function handleKeyDown(event) {
  if (event.key >= "0" && event.key <= "9") {
    emit("keypress", event.key);
  } else if (event.key === "Backspace") {
    emit("keypress", "{bksp}");
  } else if (event.key === "Enter") {
    emit("keypress", "{enter}");
  }
}

onMounted(() => {
  console.log("VirtualKeyboard mounted");
  window.addEventListener("keydown", handleKeyDown);
  
  // Defensive way to get the constructor
  let KClass = Keyboard;
  if (KClass.default) KClass = KClass.default;
  
  try {
    keyboard = new KClass(".simple-keyboard-target", {
      onKeyPress: (button) => emit("keypress", button),
      layout: {
        default: ["1 2 3", "4 5 6", "7 8 9", "{bksp} 0 {enter}"],
      },
      display: {
        "{bksp}": "⌫",
        "{enter}": "OK",
      },
    });

    if (props.input) {
      keyboard.setInput(props.input);
    }
  } catch (err) {
    console.error("SimpleKeyboard error:", err);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
  if (keyboard) {
    keyboard.destroy();
  }
});

watch(
  () => props.input,
  (newVal) => {
    if (keyboard && keyboard.getInput() !== newVal) {
      keyboard.setInput(newVal);
    }
  }
);
</script>

<template>
  <div class="my-6 p-4 border-2 border-green-500 rounded bg-white shadow-lg">
    <p class="text-xs text-gray-400 mb-2">Componente Teclado</p>
    <!-- We use a unique class here -->
    <div class="simple-keyboard-target hg-theme-default"></div>
  </div>
</template>

<style>
/* CSS global (sin scoped) para asegurar que la librería lo vea */
.simple-keyboard-target {
  max-width: 400px;
  margin: 0 auto;
  min-height: 200px; /* Force visibility */
}

/* Ensure keys are visible and interactive */
.hg-theme-default .hg-button {
  height: 60px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 1.5rem !important;
}
</style>
