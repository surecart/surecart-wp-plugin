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
  if (state.text.loading[value] === undefined) return;

  speak(state.text.loading[value], 'assertive');
});

export default service;
