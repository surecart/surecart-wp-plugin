import { Component, h, Host, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

import { FormState, ResponseError } from '../../../../types';

/**
 * This component listens for a confirmed event and redirects to the success url.
 */
@Component({
  tag: 'sc-checkout-form-errors',
  shadow: true,
})
export class ScCheckoutFormErrors {
  /** The current order. */
  @Prop() checkoutState: FormState;

  /** Error to display. */
  @Prop() error: ResponseError | null;

  /** This filters the error message with some more client friendly error messages. */
  getErrorMessage(error) {
    if (error.code === 'order.line_items.price.blank') {
      return __('This product is no longer purchasable.', 'surecart');
    }
    return <span innerHTML={error?.message}></span>;
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
    // don't show component if no error message or is finalizing or updating.
    if (!this.errorMessage() || ['finalizing', 'updating'].includes(this.checkoutState)) {
      return <Host style={{ display: 'none' }}></Host>;
    }

    return (
      <Host>
        <sc-alert type="danger" scrollOnOpen={true} open={!!this.errorMessage()}>
          <span slot="title">{this.errorMessage()}</span>
        </sc-alert>
        <slot />
      </Host>
    );
  }
}

openWormhole(ScCheckoutFormErrors, ['checkoutState', 'error'], false);
