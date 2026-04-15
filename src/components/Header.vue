<script setup>
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const route = useRoute();
const { locale } = useI18n();

function isActive(path) {
  return route.path === path;
}
</script>

<template>
  <header class="bg-blue-500 text-white p-4 relative shadow-md">
    <!-- centered navigation -->
    <div class="flex justify-center gap-6">
      <RouterLink to="/">{{ $t("header.home") }}</RouterLink>
      <RouterLink to="/tables">{{ $t("header.tables") }}</RouterLink>
    </div>

    <!-- language switch -->
    <div class="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
      <button
        @click="locale = 'es'"
        :class="{ underline: locale === 'es' }"
        class="hover:underline"
      >
        ES
      </button>

      <button
        @click="locale = 'en'"
        :class="{ underline: locale === 'en' }"
        class="hover:underline"
      >
        EN
      </button>
    </div>
  </header>
</template>
