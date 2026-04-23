import { createMachine, assign, fromCallback } from 'xstate';

/**
 * Level configurations defining which multiplication tables and ranges are used for each level.
 */
export const levels = {
  1: { tables: [1, 2, 10], range: [1, 10] },
  2: { tables: [3, 4, 5], range: [1, 10] },
  3: { tables: [6, 7, 8, 9], range: [1, 10] },
  4: { tables: [6, 7, 8, 11], range: [1, 10] },
  5: { tables: [12, 13], range: [1, 10] },
};

/**
 * XState machine that manages the game state, timer, and question logic.
 */
export const gameMachine = createMachine({
  id: 'game',
  initial: 'idle',
  
  // Initial context structure (state data)
  context: ({ input }) => ({
    level: input.level,
    question: null,
    correctAnswer: null,
    userAnswer: '',
    timeLeft: 60,
    attempts: 0,
    correct: 0,
    incorrect: 0,
    history: [],
    questionsPool: [],
    questionStartTime: 0,
    lastQuestion: '',
  }),

  states: {
    // Waiting state before the game starts
    idle: {
      on: {
        START: {
          target: 'playing',
          actions: ['initializeGame']
        }
      }
    },

    // Active gameplay state
    playing: {
      entry: ['generateQuestion'],
      
      // Timer service: decrements timeLeft every second
      invoke: {
        src: fromCallback(({ sendBack }) => {
          const interval = setInterval(() => {
            sendBack({ type: 'TICK' });
          }, 1000);
          return () => clearInterval(interval);
        }),
      },

      on: {
        // Appends a digit to the current user answer
        INPUT_NUMBER: {
          actions: assign({
            userAnswer: ({ context, event }) => context.userAnswer + event.value
          })
        },
        // Removes the last digit from the user answer
        BACKSPACE: {
          actions: assign({
            userAnswer: ({ context }) => context.userAnswer.slice(0, -1)
          })
        },
        // Submits the answer and moves to the next question
        SUBMIT: {
          actions: ['processAnswer', 'generateQuestion']
        },
        // Handles timer countdown and game over condition
        TICK: [
          {
            target: 'gameOver',
            guard: ({ context }) => context.timeLeft <= 1,
            actions: assign({ timeLeft: 0 })
          },
          {
            actions: assign({
              timeLeft: ({ context }) => context.timeLeft - 1
            })
          }
        ],
        // Allows restarting the game while playing
        RESTART: {
          target: 'playing',
          actions: ['initializeGame']
        }
      }
    },

    // State reached when the timer runs out
    gameOver: {
      on: {
        RESTART: {
          target: 'playing',
          actions: ['initializeGame']
        }
      }
    }
  }
}, {
  actions: {
    // Resets counters and statistics for a new game session
    initializeGame: assign({
      timeLeft: 60,
      attempts: 0,
      correct: 0,
      incorrect: 0,
      history: [],
      questionsPool: [],
      userAnswer: '',
      lastQuestion: ''
    }),

    // Evaluates the submitted answer and records statistics/history
    processAnswer: assign(({ context }) => {
      const isCorrect = Number(context.userAnswer) === context.correctAnswer;
      const timeSpent = performance.now() - context.questionStartTime;
      
      const newHistory = [
        ...context.history,
        {
          question: context.question,
          correct: isCorrect,
          time: timeSpent,
        }
      ];

      return {
        attempts: context.attempts + 1,
        correct: isCorrect ? context.correct + 1 : context.correct,
        incorrect: isCorrect ? context.incorrect : context.incorrect + 1,
        history: newHistory,
        userAnswer: ''
      };
    }),

    // Picks a new question from the pool. If the pool is empty, it generates a new shuffled one.
    generateQuestion: assign(({ context }) => {
      let pool = [...context.questionsPool];

      // Generate a new pool if empty based on current level configuration
      if (pool.length === 0) {
        const lvl = levels[context.level];
        if (!lvl) return {};
        
        lvl.tables.forEach((table) => {
          for (let i = lvl.range[0]; i <= lvl.range[1]; i++) {
            pool.push({ table, multiplier: i });
          }
        });

        // Fisher-Yates shuffle algorithm
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        // Avoid repeating the same question twice in a row
        if (pool.length > 1 && `${pool[0].table} x ${pool[0].multiplier}` === context.lastQuestion) {
          const first = pool.shift();
          pool.push(first);
        }
      }

      // Pick the next question from the shuffled pool
      const { table, multiplier } = pool.shift();
      const newQuestion = `${table} x ${multiplier}`;

      return {
        questionsPool: pool,
        question: newQuestion,
        correctAnswer: table * multiplier,
        lastQuestion: newQuestion,
        questionStartTime: performance.now()
      };
    })
  }
});
