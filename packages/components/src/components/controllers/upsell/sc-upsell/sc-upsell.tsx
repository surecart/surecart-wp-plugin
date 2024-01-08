/**
 * External dependencies.
 */
import { Component, Host, h } from '@stencil/core';

/**
 * Internal dependencies.
 */
import { state } from '@store/upsell';
import { createOrUpdateUpsell, redirectUpsell } from '@store/upsell/mutations';
import { isUpsellExpired } from '@store/upsell/getters';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-upsell',
  styleUrl: 'sc-upsell.scss',
  shadow: true,
})
export class ScUpsell {
  componentWillLoad() {
    createOrUpdateUpsell();
  }

  componentDidLoad() {
    // check for upsell redirection every second.
    this.maybeRedirectUpsell();
    setInterval(() => {
      this.maybeRedirectUpsell();
    }, 1000);
  }

  maybeRedirectUpsell() {
    if (isUpsellExpired()) {
      redirectUpsell();
    }
  }

  render() {
    return (
      <Host>
        <slot />
        {['loading', 'busy'].includes(state?.loading || '') && <sc-block-ui style={{ 'z-index': '30' }}></sc-block-ui>}

        <sc-dialog open={state.loading === 'complete'} style={{ '--body-spacing': 'var(--sc-spacing-xxx-large)' }} noHeader onScRequestClose={e => e.preventDefault()}>
          <div class="confirm__icon">
            <div class="confirm__icon-container">
              <sc-icon name="check" />
            </div>
          </div>
          <sc-dashboard-module
            heading={state?.text?.success?.title || __('Thanks for your order!', 'surecart')}
            style={{ '--sc-dashboard-module-spacing': 'var(--sc-spacing-x-large)', 'textAlign': 'center' }}
          >
            <span slot="description">{state?.text?.success?.description || __('Your payment was successful. A receipt is on its way to your inbox.', 'surecart')}</span>

            {/* {!!manualPaymentMethod?.name && !!manualPaymentMethod?.instructions && (
              <sc-alert type="info" open style={{ 'text-align': 'left' }}>
                <span slot="title">{manualPaymentMethod?.name}</span>
                {manualPaymentMethod?.instructions.split('\n').map(i => {
                  return <p>{i}</p>;
                })}
              </sc-alert>
            )} */}

            <sc-button href={window?.scData?.pages?.dashboard} size="large" type="primary" autofocus={true}>
              {state?.text?.success?.button || __('Continue', 'surecart')}
              <sc-icon name="arrow-right" slot="suffix" />
            </sc-button>
          </sc-dashboard-module>
        </sc-dialog>
      </Host>
    );
  }
}
