import { createStore } from '@stencil/store';
import { checkoutMachine } from '../../../src/components/providers/form-state-provider/checkout-machine';
import { __ } from '@wordpress/i18n';
import { getSerializedState } from '@store/utils';
const { form } = getSerializedState();

interface Store {
  formState: any;
  text: {
    loading: {
      finalizing: string;
      paying: string;
      confirming: string;
      confirmed: string;
      redirecting: string;
    };
    success: {
      title: string;
      description: string;
      button: string;
    };
  };
}

const { state, onChange, on, set, get, dispose } = createStore<Store>(
  {
    formState: checkoutMachine.initialState,
    text: {
      loading: {
        finalizing: __('Submitting order...', 'surecart'),
        paying: __('Processing payment...', 'surecart'),
        confirming: __('Finalizing order...', 'surecart'),
        confirmed: __('Success!', 'surecart'),
        redirecting: __('Success! Redirecting...', 'surecart'),
      },
      success: {
        title: __('Thanks for your order!', 'surecart'),
        description: __('Your payment was successful, and your order is complete. A receipt is on its way to your inbox.', 'surecart'),
        button: __('Continue', 'surecart'),
      },
    },
    ...form,
  },
  (newValue, oldValue, propChanged) => {
    if (propChanged === 'formState') {
      return newValue.value !== oldValue.value;
    }
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

export default state;
export { state, onChange, on, set, get, dispose };
