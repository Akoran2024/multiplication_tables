import { createI18n } from "vue-i18n";

const messages = {
  es: {
    header: {
      home: "Inicio",
      tables: "Tablas",
    },
    home: {
      title: "Selecciona nivel",
      description:
        "Elige un nivel y practica las tablas de multiplicar. Tienes 60 segundos para responder tantas preguntas como puedas. ¡Intenta acertar el máximo posible!",
      level1: "Nivel 1: Tablas del 1, 2 y 10",
      level2: "Nivel 2: Tablas del 3, 4 y 5",
      level3: "Nivel 3: Tablas del 6, 7, 8 y 9",
      level4: "Nivel 4: Tablas del 6, 7, 8 (por números de 6 a 9) y 11",
      level5: "Nivel 5: Tablas del 12 y 13",
    },
    game: {
      time: "Tiempo",
      attempts: "Intentos",
      correct: "Aciertos",
      incorrect: "Fallos",
      history: "Historial de preguntas",
      restart: "Reiniciar nivel",
      home: "Volver al inicio",
      ready: "¿Listo?",
      start: "EMPEZAR",
    },
    tables: {
      title: "Tablas de multiplicar",
      tableOf: "Tabla del",
    },
  },
  en: {
    header: {
      home: "Home",
      tables: "Tables",
    },
    home: {
      title: "Select level",
      description:
        "Choose a level and practice multiplication tables. You have 60 seconds to answer as many questions as possible. Try to get the highest score!",
      level1: "Level 1: Tables of 1, 2 and 10",
      level2: "Level 2: Tables of 3, 4 and 5",
      level3: "Level 3: Tables of 6, 7, 8 and 9",
      level4: "Level 4: Tables of 6, 7, 8 (from numbers 6 to 9) and 11",
      level5: "Level 5: Tables of 12 and 13",
    },
    game: {
      time: "Time",
      attempts: "Attempts",
      correct: "Correct",
      incorrect: "Wrong",
      history: "Question history",
      restart: "Restart level",
      home: "Back to home",
      ready: "Ready?",
      start: "START",
    },
    tables: {
      title: "Multiplication tables",
      tableOf: "Table of",
    },
  },
};

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: "es",
  fallbackLocale: "en",
  messages,
});
