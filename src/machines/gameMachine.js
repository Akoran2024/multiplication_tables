import { createMachine, assign, fromCallback } from 'xstate';

export const gameMachine = createMachine({
  id: 'game',
  initial: 'idle',
  
  // Context holds the reactive data (score, timer, current question, etc.)
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
    // Idle: Initial state where the "Start" button is shown
    idle: {
      on: {
        START: {
          target: 'playing',
          actions: ['initializeGame']
        }
      }
    },

    // Playing: Active state where the timer runs and the user answers questions
    playing: {
      entry: ['generateQuestion'],
      
      // Invoke a callback service to handle the 1-second countdown timer
      invoke: {
        src: fromCallback(({ sendBack }) => {
          const interval = setInterval(() => {
            sendBack({ type: 'TICK' });
          }, 1000);
          return () => clearInterval(interval);
        }),
      },

      on: {
        INPUT_NUMBER: {
          actions: assign({
            userAnswer: ({ context, event }) => context.userAnswer + event.value
          })
        },
        BACKSPACE: {
          actions: assign({
            userAnswer: ({ context }) => context.userAnswer.slice(0, -1)
          })
        },
        SUBMIT: {
          actions: ['processAnswer', 'generateQuestion']
        },
        // TICK event is triggered every second by the invoked timer
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
        RESTART: {
          target: 'playing',
          actions: ['initializeGame']
        }
      }
    },

    // GameOver: Final state showing results and allowing a restart
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
    // Resets all game data to start fresh
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

    // Evaluates the user's answer and updates history/stats
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

    // Logic to pick a new question from the pool or generate a new pool
    generateQuestion: assign(({ context }) => {
      let pool = [...context.questionsPool];
      
      const levels = {
        1: { tables: [1, 2, 10], range: [1, 10] },
        2: { tables: [3, 4, 5], range: [1, 10] },
        3: { tables: [6, 7, 8, 9], range: [1, 10] },
        4: { tables: [6, 7, 8, 11], range: [1, 10] },
        5: { tables: [12, 13], range: [1, 10] },
      };

      if (pool.length === 0) {
        const lvl = levels[context.level];
        if (!lvl) return {};
        
        lvl.tables.forEach((table) => {
          for (let i = lvl.range[0]; i <= lvl.range[1]; i++) {
            pool.push({ table, multiplier: i });
          }
        });

        // Fisher-Yates Shuffle
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        // Avoid repeating the immediate last question
        if (pool.length > 1 && `${pool[0].table} x ${pool[0].multiplier}` === context.lastQuestion) {
          const first = pool.shift();
          pool.push(first);
        }
      }

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
