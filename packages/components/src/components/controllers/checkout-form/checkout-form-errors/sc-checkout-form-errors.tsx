/**
 * External dependencies.
 */
import { Component, h, Host } from '@stencil/core';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { state as errorState } from '@store/notices';
import { getErrorMessage, getErrorMessages, getNoticeTitle } from '@store/notices/getters';
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

  /**
   * Render the error messages.
   *
   * If there is only one error message, render it as a string.
   * Otherwise, render it as a list.
   *
   * @returns string
   */
  renderErrorMessages() {
    // if notice title and error message are same, then return empty.
    if (getNoticeTitle() === getErrorMessage()) {
      return '';
    }

    return (
      <ul>
        {getErrorMessages().map((message, key) => (
          <li key={key}>{message}</li>
        ))}
      </ul>
    );
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

  render() {
    // don't show component if no error message or is finalizing or updating.
    if (!getErrorMessages().length || ['finalizing', 'updating'].includes(currentFormState())) {
      return <Host style={{ display: 'none' }}></Host>;
    }

    return (
      <Host>
        <sc-alert type={this.getAlertType()} scrollOnOpen={true} open={!!getErrorMessage()} closable={!!errorState?.dismissible} title={getNoticeTitle()}>
          {this.renderErrorMessages()}
        </sc-alert>
        <slot />
      </Host>
    );
  }
}
