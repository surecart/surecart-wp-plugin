import { Component, h, State, Event, EventEmitter, Listen, Watch, Prop, Host } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Order, ResponseError } from '../../../types';

/**
 * This component listens for a confirmed event and redirects to the success url.
 */
@Component({
  tag: 'sc-form-error-provider',
  shadow: true,
})
export class ScFormErrorProvider {
  /** The current order. */
  @Prop() order: Order;

  /** Set the state. */
  @Event() scUpdateError: EventEmitter<ResponseError>;

  /** Error to display. */
  @State() error: ResponseError | null;

  /** Trigger the error event when an error happens  */
  @Watch('error')
  handleErrorUpdate(val) {
    this.scUpdateError.emit(val);
  }

  @Watch('order')
  handleOrderChange() {
    this.error = null;
  }

  /** Listen for error events in component. */
  @Listen('scError')
  handleErrorEvent(e) {
    this.error = e.detail as ResponseError;
  }

  /** Listen for pay errors. */
  @Listen('scPayError')
  handlePayError(e) {
    this.error = e.detail?.message || {
      code: '',
      message: 'Something went wrong with your payment.',
    };
  }

  /** This filters the error message with some more client friendly error messages. */
  getErrorMessage(error) {
    if (error.code === 'order.line_items.price.blank') {
      return __('This product is no longer purchasable.', 'surecart');
    }
    return error?.message;
  }

  /** First will display validation error, then main error if no validation errors. */
  errorMessage() {
    if (this.error?.additional_errors?.[0]?.message) {
      return this.getErrorMessage(this.error?.additional_errors?.[0]);
    } else if (this?.error?.message) {
      return this.getErrorMessage(this?.error);
    }
    return '';
  }

  render() {
    return (
      <Host>
        {!!this.errorMessage() && (
          <sc-alert
            type="danger"
            onScShow={e => {
              const target = e.target as HTMLElement;
              target.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
              });
            }}
            open={!!this.errorMessage()}
          >
            <span slot="title">{this.errorMessage()}</span>
          </sc-alert>
        )}

        <slot />
      </Host>
    );
  }
}
