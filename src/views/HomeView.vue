<script setup></script>

<template>
  <div class="p-6 max-w-md mx-auto text-center">
    <!-- title -->
    <h1 class="text-3xl font-bold mb-6">{{ $t("home.title") }}</h1>

    <!-- game description -->
    <p class="mb-6 text-gray-700">
      {{ $t("home.description") }}
    </p>

    <!-- level links -->
    <div class="flex flex-col gap-3">
      <RouterLink
        :to="{ name: 'game', query: { level: 1 } }"
        class="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 block"
      >
        {{ $t("home.level1") }}
      </RouterLink>

      <RouterLink
        :to="{ name: 'game', query: { level: 2 } }"
        class="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 block"
      >
        {{ $t("home.level2") }}
      </RouterLink>

      <RouterLink
        :to="{ name: 'game', query: { level: 3 } }"
        class="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 block"
      >
        {{ $t("home.level3") }}
      </RouterLink>

      <RouterLink
        :to="{ name: 'game', query: { level: 4 } }"
        class="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 block"
      >
        {{ $t("home.level4") }}
      </RouterLink>

      <RouterLink
        :to="{ name: 'game', query: { level: 5 } }"
        class="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 block"
      >
        {{ $t("home.level5") }}
      </RouterLink>
    </div>
  </div>
</template>
