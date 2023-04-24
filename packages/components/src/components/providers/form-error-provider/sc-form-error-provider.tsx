import { Component, Event, EventEmitter, h, Listen, Prop, State, Watch, Element } from '@stencil/core';
import { __ } from '@wordpress/i18n';

import { FormState, FormStateSetter, ResponseError } from '../../../types';

/**
 * This component listens for a confirmed event and redirects to the success url.
 */
@Component({
  tag: 'sc-form-error-provider',
  shadow: true,
})
export class ScFormErrorProvider {
  /** The element. */
  @Element() el: HTMLScFormErrorProviderElement;

  /** The current order. */
  @Prop() checkoutState: FormState;

  /** Set the state. */
  @Event() scUpdateError: EventEmitter<ResponseError>;

  /** Form state event. */
  @Event() scSetState: EventEmitter<FormStateSetter>;

  /** Error to display. */
  @State() error: ResponseError | null;

  /** Trigger the error event when an error happens  */
  @Watch('error')
  handleErrorUpdate(val) {
    this.scUpdateError.emit(val);
  }

  @Watch('checkoutState')
  handleStateChange(val) {
    if (['finalizing', 'updating'].includes(val)) {
      this.error = null;
    }
  }

  /** Listen for error events in component. */
  @Listen('scError')
  handleErrorEvent(e) {
    this.error = e.detail as ResponseError;
    if (Object.keys(e?.detail || {}).length) {
      this.scSetState.emit('REJECT'); // make sure we are rejecting the current state.
    }
  }

  /** Listen for pay errors. */
  @Listen('scPayError')
  handlePayError(e) {
    this.error = e.detail?.message || {
      code: '',
      message: 'Something went wrong with your payment.',
    };
  }

  componentWillLoad() {
    this.maybeAddErrorsComponent();
  }

  maybeAddErrorsComponent() {
    if (!!this.el.querySelector('sc-checkout-form-errors')) return;
    const errorsComponent = document.createElement('sc-checkout-form-errors');
    console.log(this.el.querySelector('sc-form'));
    this.el.querySelector('sc-form').prepend(errorsComponent);
  }

  render() {
    return <slot />;
  }
}
