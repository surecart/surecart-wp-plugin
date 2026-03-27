/**
 * External dependencies.
 */
import { Component, h, State } from '@stencil/core';
import apiFetch from '@wordpress/api-fetch';
import { state as checkoutState } from '@store/checkout';
import MD5 from 'crypto-js/md5';
import { __ } from '@wordpress/i18n';
import { speak } from '@wordpress/a11y';

/**
 * Internal dependencies.
 */
import { state as userState } from '@store/user';
import { resetUser } from '@store/user/mutations';
import { Checkout } from 'src/types';
import { createOrUpdateCheckout } from '@services/session';

@Component({
  tag: 'sc-customer-email-preview',
  styleUrl: 'sc-customer-email-preview.scss',
  shadow: true,
})
export class ScCustomerEmailPreview {
  @State() busy: boolean = false;

  async logout() {
    try {
      this.busy = true;

      // Clear checkout state first.
      checkoutState.checkout = (await createOrUpdateCheckout({ id: checkoutState.checkout.id, data: { email: '' } })) as Checkout;

      // Logout.
      const response = (await apiFetch({
        method: 'POST',
        path: 'surecart/v1/logout',
      })) as any;

      // Update the nonce after logout to prevent rest_cookie_invalid_nonce errors.
      // @ts-ignore - nonceMiddleware is set in fetch.ts but not in @wordpress/api-fetch types.
      if (response?.nonce && apiFetch.nonceMiddleware) {
        // @ts-ignore
        apiFetch.nonceMiddleware.nonce = response.nonce;
      }

      // Reset user state.
      resetUser();

      speak(__('Logged out successfully.', 'surecart'), 'assertive');
    } catch (e) {
      console.error(e);
    } finally {
      this.busy = false;
    }
  }

  render() {
    return (
      <div class="email-preview">
        <div class="email-preview__info">
          <sc-avatar
            image={`https://secure.gravatar.com/avatar/${MD5((userState.email || '').toLowerCase().trim())}?size=48&default=404`}
            initials={(userState?.name || userState?.email).charAt(0)}
          />
          <div class="email-preview__text">
            <div class="email-preview__name">{userState.name}</div>
            <div class="email-preview__email">{userState.email}</div>
          </div>
        </div>
        <sc-dropdown placement="bottom-end">
          <sc-button type="text" slot="trigger" loading={this.busy}>
            <sc-icon name="chevron-down" aria-label={__('Toggle dropdown', 'surecart')}></sc-icon>
          </sc-button>
          <sc-menu>
            <sc-menu-item onClick={() => this.logout()}>
              <sc-icon slot="prefix" name="log-out"></sc-icon>
              {__('Logout', 'surecart')}
            </sc-menu-item>
          </sc-menu>
        </sc-dropdown>
      </div>
    );
  }
}
