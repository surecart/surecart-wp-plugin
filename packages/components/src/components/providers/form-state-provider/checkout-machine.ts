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
        REJECT: 'draft',
      },
    },
    updating: {
      on: {
        RESOLVE: 'draft',
        EXPIRE: 'expired',
        REJECT: 'draft',
      },
    },
    finalizing: {
      on: {
        PAYING: 'paying',
        REJECT: 'draft',
      },
    },
    paying: {
      on: {
        PAID: 'confirming',
        REJECT: 'draft',
      },
    },
    confirming: {
      on: {
        CONFIRMED: 'confirmed',
      },
    },
    paid: {
      on: {
        CONFIRMED: 'confirmed',
        REJECT: 'draft',
      },
    },
    expired: {},
    confirmed: {},
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
