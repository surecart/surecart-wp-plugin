import { Component, h, Event, EventEmitter, Listen, Watch, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { ResponseError } from '../../../types';

/**
 * This component listens for a confirmed event and redirects to the success url.
 */
@Component({
  tag: 'sc-error',
  shadow: true,
})
export class ScFormErrorProvider {
  /** Set the state. */
  @Event() scUpdateError: EventEmitter<ResponseError>;

  /** Error to display. */
  @Prop() error: ResponseError | null;

  /** Trigger the error event when an error happens  */
  @Watch('error')
  handleErrorUpdate(val) {
    this.scUpdateError.emit(val);
  }

  /** Listen for error events in component. */
  @Listen('scError')
  handleErrorEvent(e) {
    this.error = e.detail as ResponseError;
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
    return !!this.errorMessage() ? (
      <sc-alert type="danger" scrollOnOpen={true} open={!!this.errorMessage()}>
        <span slot="title">{this.errorMessage()}</span>
      </sc-alert>
    ) : null;
  }
}
