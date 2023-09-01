/**
 * External dependencies.
 */
import { Component, h, Host, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { state as errorState } from '@store/notices';
import { getErrorMessage, getErrorMessages } from '@store/notices/getters';
import { FormState } from '../../../../types';

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

  getAlertType() {
    switch (errorState?.type) {
      case 'error':
        return 'danger';

      case 'default':
        return 'primary';

      default:
        return errorState?.type;
    }
  }

  /**
   * Render the error messages.
   *
   * If there is only one error message, render it as a string.
   * Otherwise, render it as a list.
   *
   * @returns string
   */
  renderErrorMessages() {
    if (getErrorMessages().length == 1) {
      return getErrorMessage();
    }

    return (
      <ul>
        {(getErrorMessages() || []).map((message, key) => (
          <li key={key}>{message}</li>
        ))}
      </ul>
    );
  }

  render() {
    // don't show component if no error message or is finalizing or updating.
    if (!!getErrorMessages.length || ['finalizing', 'updating'].includes(this.checkoutState)) {
      return <Host style={{ display: 'none' }}></Host>;
    }

    return (
      <Host>
        <sc-alert type={this.getAlertType()} scrollOnOpen={true} open={!!getErrorMessage()} closable={errorState?.dismissible}>
          {this.renderErrorMessages()}
        </sc-alert>
        <slot />
      </Host>
    );
  }
}

openWormhole(ScCheckoutFormErrors, ['checkoutState'], false);
