import { createMachine, assign } from '@xstate/fsm';

export const checkoutMachine = createMachine({
  id: 'fetch',
  initial: 'draft',
  context: {
    retries: 3,
  },
  states: {
    draft: {
      on: {
        PAID: 'confirming',
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
        PAID: 'confirming',
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
          target: 'updating',
          actions: assign({
            retries: (context: { retries: number }) => context.retries + 1,
          }),
        },
      },
    },
  },
});

export default checkoutMachine;
