import { createMachine, assign } from '@xstate/fsm';

export const checkoutMachine = createMachine({
  id: 'fetch',
  initial: 'idle',
  context: {
    retries: 3,
  },
  states: {
    idle: {
      on: {
        FETCH: 'loading',
      },
    },
    loading: {
      on: {
        RESOLVE: 'draft',
        REJECT: 'failure',
      },
    },
    draft: {
      on: {
        FINALIZE: 'finalized',
        FETCH: 'updating',
      },
    },
    updating: {
      on: {
        RESOLVE: 'draft',
        REJECT: 'draft',
      },
    },
    finalized: {
      on: {
        PAYING: 'paying',
        DRAFT: 'updating',
      },
    },
    paying: {
      on: {
        PAID: 'paid',
      },
    },
    paid: {},
    failure: {
      on: {
        RETRY: {
          target: 'loading',
          actions: assign({
            retries: (context: { retries: number }) => context.retries + 1,
          }),
        },
      },
    },
  },
});

export default checkoutMachine;
