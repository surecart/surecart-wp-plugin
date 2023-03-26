import { createStore } from '@stencil/store';
import { checkoutMachine } from '../../../src/components/providers/form-state-provider/checkout-machine';

interface Store {
  formState: any;
}

const { state, onChange, on, set, get, dispose } = createStore<Store>(
  {
    formState: checkoutMachine.initialState,
  },
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

export default state;
export { state, onChange, on, set, get, dispose };
