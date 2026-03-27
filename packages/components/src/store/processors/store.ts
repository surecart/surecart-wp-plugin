import { createStore } from '@stencil/store';
import { ManualPaymentMethod, PaymentMethodType, Processor } from '../../types';
import { getSerializedState } from '@store/utils';
const { processors } = getSerializedState();

interface Store {
  processors: Processor[];
  methods: PaymentMethodType[];
  manualPaymentMethods: ManualPaymentMethod[];
  disabled: {
    processors: string[];
  };
  sortOrder: {
    processors: string[];
    manualPaymentMethods: string[];
    paymentMethods: {
      mollie: string[];
    };
  };
  instances: {
    stripe?: any;
    stripeElements: any;
  };
  config: {
    stripe: {
      paymentElement: boolean;
    };
  };
}

const { state, onChange, on, dispose } = createStore<Store>(
  {
    processors: [],
    methods: [],
    manualPaymentMethods: [],
    disabled: {
      processors: [],
    },
    sortOrder: {
      processors: ['stripe', 'paystack', 'paypal', 'mollie', 'mock'],
      manualPaymentMethods: [],
      paymentMethods: {
        mollie: ['creditcard', 'paypal'],
      },
    },
    instances: {
      stripe: undefined,
    },
    config: {
      stripe: {
        paymentElement: false,
      },
    },
    ...processors,
  },
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

export default state;
export { state, onChange, on, dispose };
