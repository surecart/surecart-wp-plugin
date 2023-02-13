import { createStore } from '@stencil/store';

const { state, onChange, on } = createStore<any>(
  () => ({
    processors: [],
    methods: [],
    manualPaymentMethods: [],
    sortOrder: {
      processors: ['stripe', 'paypal'],
      manualPaymentMethods: [],
      paymentMethods: {
        mollie: ['creditcard', 'paypal'],
      },
    },
  }),
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

export default state;
export { state, onChange, on };
