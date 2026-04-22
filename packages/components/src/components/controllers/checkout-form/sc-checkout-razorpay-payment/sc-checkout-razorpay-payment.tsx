import { Component, Prop } from '@stencil/core';
import { addQueryArgs } from '@wordpress/url';

import { state as checkoutState } from '@store/checkout';
import { listenTo } from '@store/checkout/functions';
import { lockCheckout, unLockCheckout } from '@store/checkout/mutations';
import { createErrorNotice } from '@store/notices/mutations';
import { state as processorsState } from '@store/processors';

import apiFetch from '../../../../functions/fetch';
import { Pagination, PaymentMethodType, ResponseError } from '../../../../types';

/**
 * Headless fetcher — keeps Razorpay's available payment methods in sync with the checkout.
 *
 * Razorpay requires an explicit `payment_method_type` when creating a recurring order; it
 * can't fan methods out automatically the way one-time checkouts do. This component calls
 * the same `processors/:id/payment_method_types` endpoint Mollie uses and writes the filtered
 * list into `processorsState.methods`. The actual `sc-payment-method-choice` elements are
 * rendered by `sc-payment` itself so they stay as direct siblings of the other processors
 * (stripe/mock/etc.) — that's what keeps the sibling-detection-driven toggle behaviour
 * correct. If we rendered them inside this component's shadow root, each choice would lose
 * sight of its siblings and fall back to an always-open `div`.
 *
 * Intentionally renders nothing.
 */
@Component({
  tag: 'sc-checkout-razorpay-payment',
  shadow: true,
})
export class ScCheckoutRazorpayPayment {
  @Prop() processorId: string;

  private unlistenToCheckout?: () => void;

  componentWillLoad() {
    this.fetchMethods();
    this.unlistenToCheckout = listenTo('checkout', ['currency', 'reusable_payment_method_required'], () => this.fetchMethods());
  }

  disconnectedCallback() {
    this.unlistenToCheckout?.();
    // Clear shared methods state so a later mollie / non-recurring flow starts clean.
    processorsState.methods = [];
  }

  async fetchMethods() {
    const checkout = checkoutState.checkout;
    if (!checkout?.currency || !this.processorId) return;

    try {
      lockCheckout('methods');
      const response = (await apiFetch({
        path: addQueryArgs(`surecart/v1/processors/${this.processorId}/payment_method_types`, {
          currency: checkout.currency,
          reusable: !!checkout.reusable_payment_method_required,
          per_page: 100,
        }),
      })) as {
        object: 'list';
        pagination: Pagination;
        data: PaymentMethodType[];
      };
      processorsState.methods = response?.data || [];
    } catch (e) {
      createErrorNotice(e as ResponseError);
      console.error(e);
    } finally {
      unLockCheckout('methods');
    }
  }

  render() {
    return null;
  }
}
