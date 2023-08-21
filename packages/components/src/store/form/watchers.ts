import { checkoutMachine } from '../../../src/components/providers/form-state-provider/checkout-machine';
import { interpret } from '@xstate/fsm';
import state from './store';

// Start state machine.
const service = interpret(checkoutMachine);
service.subscribe(stateService => (state.formState = stateService));
service.start();
export default service;
