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
        EXPIRE: 'expired',
        PAID: 'paid',
      },
    },
    draft: {
      on: {
        FINALIZE: 'finalizing',
        FETCH: 'updating',
      },
    },
    updating: {
      on: {
        RESOLVE: 'draft',
        REJECT: 'draft',
        EXPIRE: 'expired',
        FINALIZED: 'finalized',
      },
    },
    finalizing: {
      on: {
        PAID: 'paid',
        REJECT: 'draft',
      },
    },
    expired: {},
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
