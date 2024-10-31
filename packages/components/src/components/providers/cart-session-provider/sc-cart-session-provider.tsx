import { Component, Element, Event, EventEmitter, h, Listen } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { state as checkoutState } from '@store/checkout';

import { updateCheckout } from '../../../services/session';
import { Checkout, LineItemData } from '../../../types';
import { createErrorNotice } from '@store/notices/mutations';
import { updateFormState } from '@store/form/mutations';
import { clearCheckout } from '@store/checkout/mutations';

@Component({
  tag: 'sc-cart-session-provider',
  shadow: true,
})
export class ScCartSessionProvider {
  /** Element */
  @Element() el: HTMLElement;

  /** Set the state */
  @Event() scSetState: EventEmitter<'loading' | 'busy' | 'navigating' | 'idle'>;

  @Listen('scUpdateOrder')
  handleUpdateSession(e) {
    const { data, options } = e.detail;
    if (options?.silent) {
      this.update(data);
    } else {
      this.loadUpdate(data);
    }
  }

  /** Handle the error response. */
  handleErrorResponse(e) {
    if (e?.code === 'readonly' || e?.additional_errors?.[0]?.code === 'checkout.customer.account_mismatch') {
      clearCheckout();
    }

    // expired
    if (e?.code === 'rest_cookie_invalid_nonce') {
      updateFormState('EXPIRE');
      return;
    }

    // something went wrong
    if (e?.message) {
      createErrorNotice(e);
    }

    // handle curl timeout errors.
    if (e?.code === 'http_request_failed') {
      createErrorNotice(__('Something went wrong. Please reload the page and try again.', 'surecart'));
    }
  }

  /** Fetch a session. */
  async fetch(args = {}) {
    this.loadUpdate({ status: 'draft', ...args });
  }

  /** Update a the order */
  async update(data = {}, query = {}) {
    try {
      checkoutState.checkout = (await updateCheckout({
        id: checkoutState.checkout?.id,
        data: {
          ...data,
        },
        query: {
          ...query,
        },
      })) as Checkout;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  /** Updates a session with loading status changes. */
  async loadUpdate(data = {}) {
    try {
      updateFormState('FETCH');
      await this.update(data);
      updateFormState('RESOLVE');
    } catch (e) {
      updateFormState('REJECT');
      this.handleErrorResponse(e);
    }
  }

  render() {
    return (
      <sc-line-items-provider order={checkoutState.checkout} onScUpdateLineItems={e => this.loadUpdate({ line_items: e.detail as Array<LineItemData> })}>
        <slot />
      </sc-line-items-provider>
    );
  }
}
