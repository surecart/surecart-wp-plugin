import { createStore } from '@stencil/store';
import { ManualPaymentMethod, PaymentMethodType, Processor } from '../../types';

interface Store {
  processors: Processor[];
  methods: PaymentMethodType[];
  manualPaymentMethods: ManualPaymentMethod[];
  sortOrder: {
    processors: string[];
    manualPaymentMethods: string[];
    paymentMethods: {
      mollie: string[];
    };
  };
}

const { state, onChange, on, dispose } = createStore<Store>(
  {
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
  },
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

export default state;
export { state, onChange, on, dispose };
