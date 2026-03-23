<script setup>
// emitimos eventos al padre (GameView)
const emit = defineEmits(['input', 'delete', 'submit'])

// cuando pulsa número
function pressNumber(num) {
  emit('input', num)
}

// borrar
function pressDelete() {
  emit('delete')
}

// enviar respuesta
function pressSubmit() {
  emit('submit')
}
</script>

<template>
  <div class="grid grid-cols-3 gap-3 max-w-xs mx-auto mt-4">

    <!-- números -->
    <button 
      v-for="n in 9" 
      :key="n"
      class="p-4 bg-gray-800 text-white rounded text-xl active:scale-95"
      @click="pressNumber(n)">
      {{ n }}
    </button>

    <!-- borrar -->
    <button 
      class="p-4 bg-yellow-400 rounded text-xl active:scale-95"
      @click="pressDelete">
      ⌫
    </button>

    <!-- 0 -->
    <button 
      class="p-4 bg-gray-800 text-white rounded text-xl active:scale-95"
      @click="pressNumber(0)">
      0
    </button>

    <!-- enviar -->
    <button 
      class="p-4 bg-green-500 text-white rounded text-xl active:scale-95"
      @click="pressSubmit">
      OK
    </button>

  </div>
</template>