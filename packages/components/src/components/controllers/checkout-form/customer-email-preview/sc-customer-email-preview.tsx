/**
 * External dependencies.
 */
import { Component, h, Host, State } from '@stencil/core';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { state as userState } from '@store/user';

@Component({
  tag: 'sc-customer-email-preview',
  styleUrl: 'sc-customer-email-preview.scss',
  shadow: false,
})
export class ScCustomerEmailPreview {
  @State() busy: boolean = false;

  async logout() {
    try {
      this.busy = true;
      await apiFetch({
        method: 'POST',
        path: 'surecart/v1/logout'
      });

      userState.loggedIn = false;
      userState.matched = false;
      userState.email = '';
      userState.name = '';
    } catch (e) {
      console.error(e);
    } finally {
      this.busy = false;
    }
  }

  render() {
    return (
      <Host>
        <sc-flex alignItems="center" justifyContent="space-between">
          <p>{__('Email', 'surecart')}</p>
          <sc-flex justifyContent="flex-end" alignItems="center">
            <span class="customer-email">{userState.email}</span>

            <span>
              {(userState.loggedIn && (
                <sc-button type="text" onClick={() => this.logout()} loading={this.busy}>
                  <sc-icon name="log-out" />
                </sc-button>
              )) ||
                ''}
            </span>
          </sc-flex>
        </sc-flex>
      </Host>
    );
  }
}
