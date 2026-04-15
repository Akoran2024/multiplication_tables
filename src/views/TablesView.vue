<template>
  <div class="p-6 max-w-xl mx-auto">
    <!-- title -->
    <h1 class="text-3xl font-bold mb-6 text-center">
      {{ $t("tables.title") }}
    </h1>

    <!-- we go from 1 to 13 -->
    <div v-for="n in 13" :key="n" class="mb-6 bg-gray-100 p-4 rounded">
      <!-- title of each table -->
      <h2 class="font-semibold text-lg mb-2">
        {{ $t("tables.tableOf") }} {{ n }}
      </h2>

      <!-- multiplicaciones -->
      <div v-for="i in 10" :key="i" class="text-gray-700">
        {{ n }} x {{ i }} = {{ n * i }}
      </div>
    </div>
  </div>
</template>
