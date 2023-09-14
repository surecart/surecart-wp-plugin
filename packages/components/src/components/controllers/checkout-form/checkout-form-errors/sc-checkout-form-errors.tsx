/**
 * External dependencies.
 */
import { Component, h, Host } from '@stencil/core';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { state as errorState } from '@store/notices';
import { getAdditionalErrorMessages } from '@store/notices/getters';
import { currentFormState } from '@store/form/getters';
import { onChange } from '@store/form';
import { removeNotice } from '@store/notices/mutations';

/**
 * This component listens for a confirmed event and redirects to the success url.
 */
@Component({
  tag: 'sc-checkout-form-errors',
  styleUrl: 'sc-checkout-form-errors.scss',
  shadow: true,
})
export class ScCheckoutFormErrors {
  private removeStateListener = () => {};
  /**
   * Get the alert type.
   * @returns string
   */
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

  componentWillLoad() {
    // remove notice if finalizing or updating.
    this.removeStateListener = onChange('formState', () => {
      if (['finalizing', 'updating'].includes(currentFormState())) {
        removeNotice();
      }
    });
  }

  disconnectedCallback() {
    this.removeStateListener();
  }

  getTopLevelError() {
    // checkout invalid is not friendly.
    if (errorState?.code === 'checkout.invalid' && getAdditionalErrorMessages()?.length) {
      return '';
    }
    return errorState?.message;
  }

  render() {
    // don't show component if no error message or is finalizing or updating.
    if (!errorState?.message || ['finalizing', 'updating'].includes(currentFormState())) {
      return <Host style={{ display: 'none' }}></Host>;
    }

    return (
      <Host>
        <sc-alert type={this.getAlertType()} scrollOnOpen={true} open={!!errorState?.message} closable={!!errorState?.dismissible}>
          {!!this.getTopLevelError() && <span slot="title" innerHTML={this.getTopLevelError()}></span>}
          {(getAdditionalErrorMessages() || []).map((message, index) => (
            <div innerHTML={message} key={index}></div>
          ))}
        </sc-alert>
        <slot />
      </Host>
    );
  }
}
