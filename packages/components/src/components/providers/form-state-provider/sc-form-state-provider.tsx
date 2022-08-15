import { Component, h, State, Event, EventEmitter, Listen, Watch } from '@stencil/core';
import { checkoutMachine } from './checkout-machine';
import { interpret } from '@xstate/fsm';
import { __ } from '@wordpress/i18n';
import { FormState, FormStateSetter } from '../../../types';

/**
 * This component listens for a confirmed event and redirects to the success url.
 */
@Component({
  tag: 'sc-form-state-provider',
  shadow: true,
})
export class ScFormStateProvider {
  /** Holds our state machine service */
  private _stateService = interpret(checkoutMachine);

  /** Loading states for different parts of the form. */
  @State() checkoutState = checkoutMachine.initialState;

  /** Set the state. */
  @Event() scSetCheckoutFormState: EventEmitter<FormState>;

  /** Set the state. */
  setState(name) {
    const { send } = this._stateService;
    return send(name);
  }

  /** Watch for checkout state changes and emit to listeners. */
  @Watch('checkoutState')
  handleCheckoutStateChange(state) {
    this.scSetCheckoutFormState.emit(state.value);
  }

  /** Init the state service. */
  componentWillLoad() {
    // Start state machine.
    this._stateService.subscribe(state => (this.checkoutState = state));
    this._stateService.start();
  }

  /** Remove state machine on disconnect. */
  disconnectedCallback() {
    this._stateService.stop();
  }

  /** Allow children to set the form state. */
  @Listen('scSetState')
  handleSetStateEvent(e) {
    this.setState(e.detail as FormStateSetter);
  }

  /** Update the state when the order is paid. */
  @Listen('scPaid')
  async handlePaid() {
    this.setState('PAID');
  }

  render() {
    // handle expired.
    if (this.checkoutState.value === 'expired') {
      return (
        <sc-block-ui>
          <div>{__('Please refresh the page.', 'surecart')}</div>
        </sc-block-ui>
      );
    }

    return <slot />;
  }
}
