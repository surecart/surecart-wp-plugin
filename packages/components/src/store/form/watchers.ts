import { checkoutMachine } from '../../../src/components/providers/form-state-provider/checkout-machine';
import { interpret } from '@xstate/fsm';
import { speak } from '@wordpress/a11y';
import state, { onChange } from './store';

// Start state machine.
const service = interpret(checkoutMachine);
service.subscribe(stateService => (state.formState = stateService));
service.start();

// on change formState, speak the current state.
onChange('formState', () => {
  const { formState } = state;
  const { value } = formState;
  console.log('value', value);

  let speakText = '';
  switch (value) {
    case 'finalizing':
      speakText += state.text.loading.finalizing;
      break;

    case 'paying':
      speakText += state.text.loading.paying;
      break;

    case 'confirming':
      speakText += state.text.loading.confirming;
      break;

    case 'confirmed':
      speakText += state.text.loading.confirmed;
      break;

    case 'redirecting':
      speakText += state.text.loading.redirecting;
      break;

    default:
      break;
  }

  if (speakText) {
    speak(speakText, 'assertive');
  }
});

export default service;
