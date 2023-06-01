/**
 * Internal dependencies.
 */
import { state as checkoutState } from '@store/checkout';
import { state as selectedProcessor } from '../../selected-processor';
import { onChange as onChangeCheckoutForm } from '../../form';
import { maybeConfirmOrderForPaystack } from './paystack';

const maybeConfirmOrderForProcessor = async (formState) => {
  const val = formState.value ?? '';
  const { checkout } = checkoutState;

  // Stop if not in paying state.
  if (val !== 'paying') return;

  switch (selectedProcessor?.id) {
    case 'paystack':
      await maybeConfirmOrderForPaystack(val, checkout);
      break;

    default:
      break;
  }
}

// when checkout states changes handle for specific processor.
onChangeCheckoutForm('formState', (val) => {
  maybeConfirmOrderForProcessor(val);
});
