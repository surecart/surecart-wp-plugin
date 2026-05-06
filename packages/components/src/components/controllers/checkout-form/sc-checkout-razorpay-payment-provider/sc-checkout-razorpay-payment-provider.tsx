/**
 * External dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';
import { Component, Prop } from '@stencil/core';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import { state as checkoutState } from '@store/checkout';
import { listenTo } from '@store/checkout/functions';
import { lockCheckout, unLockCheckout } from '@store/checkout/mutations';
import { state as processorsState } from '@store/processors';
import { state as selectedProcessor } from '@store/selected-processor';
import { onChange as onChangeFormState } from '@store/form';
import { currentFormState } from '@store/form/getters';
import { updateFormState } from '@store/form/mutations';
import { createErrorNotice } from '@store/notices/mutations';
import { loadRazorpay } from 'src/functions/razorpay';
import apiFetch from '../../../../functions/fetch';
import { Customer, Pagination, PaymentMethodType, RazorpayConstructor, ResponseError } from 'src/types';

@Component({
  tag: 'sc-checkout-razorpay-payment-provider',
  shadow: true,
})
export class ScCheckoutRazorpayPaymentProvider {
  /** Razorpay processor id. Required for the recurring `payment_method_types` fetch. */
  @Prop() processorId: string;

  private unlistenToFormState?: () => void;
  private unlistenToCheckout?: () => void;
  private razorpayInstance: RazorpayConstructor | null = null;
  private confirming: boolean = false;

  componentWillLoad() {
    // Preload Razorpay script.
    loadRazorpay()
      .then(instance => (this.razorpayInstance = instance))
      .catch(err => createErrorNotice({ message: err.message }));

    // we need to listen to the form state and pay when the form state enters the paying state.
    this.unlistenToFormState = onChangeFormState('formState', () => {
      // are we paying?
      if ('paying' === currentFormState()) {
        this.confirm();
      }
    });

    // Keep the recurring payment_method_types in sync with the checkout.
    this.fetchMethods();
    this.unlistenToCheckout = listenTo('checkout', ['currency', 'reusable_payment_method_required'], () => this.fetchMethods());
  }

  disconnectedCallback() {
    // Guarded — Stencil can disconnect before componentWillLoad fires on mid-render reparenting.
    this.unlistenToFormState?.();
    this.unlistenToCheckout?.();
    // Release shared state so a later mollie / non-recurring flow starts clean.
    processorsState.methods = [];
  }

  /** Fetch enabled `payment_method_types` for recurring checkouts. No-op otherwise. */
  async fetchMethods() {
    const checkout = checkoutState.checkout;
    if (!this.processorId || !checkout?.currency) return;

    // One-time — Razorpay handles method selection in its modal. Clear any stale recurring methods.
    if (!checkout?.reusable_payment_method_required) {
      if (processorsState.methods.length) processorsState.methods = [];
      return;
    }

    try {
      lockCheckout('methods');
      const response = (await apiFetch({
        path: addQueryArgs(`surecart/v1/processors/${this.processorId}/payment_method_types`, {
          currency: checkout.currency,
          reusable: true,
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

  async confirm() {
    // this processor is not selected.
    if (selectedProcessor?.id !== 'razorpay') return;
    // Must be a razorpay session
    if (!checkoutState?.checkout?.payment_intent?.processor_data?.razorpay) return;
    // Prevent if already paid.
    if (checkoutState?.checkout?.status === 'paid') return;
    // Prevent multiple simultaneous payment attempts
    if (this.confirming) return;

    this.confirming = true;

    try {
      // must have a public_key and external_intent_id.
      const { external_intent_id, processor_data, reusable } = checkoutState?.checkout?.payment_intent || {};
      const { public_key, customer_id } = processor_data?.razorpay || {};
      if (!external_intent_id || !public_key) {
        createErrorNotice({ message: sprintf(__('Payment gateway configuration incomplete. Please ensure Razorpay is properly configured for transactions.', 'surecart')) });
        return;
      }

      // Wait for script to load if not loaded yet.
      if (!this.razorpayInstance) {
        this.razorpayInstance = await loadRazorpay();
      }

      const customer = checkoutState?.checkout?.customer as Customer | undefined;
      const prefill = customer
        ? {
            ...(customer.name && { name: customer.name }),
            ...(customer.email && { email: customer.email }),
            ...(customer.phone && { contact: customer.phone }),
          }
        : undefined;

      /*
       * Razorpay options.
       * @see https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/#123-checkout-options
       */
      let options = {
        key: public_key,
        order_id: external_intent_id,
        prefill,
        customer_id,
        recurring: reusable,
        handler: (response: any) => {
          if (response?.razorpay_payment_id) {
            return updateFormState('PAID');
          } else {
            createErrorNotice({ message: __('Payment verification failed. Please contact support.', 'surecart') });
            updateFormState('REJECT');
          }
        },
        modal: {
          ondismiss: () => {
            updateFormState('REJECT');
          },
        },
      };

      if (window?.wp?.hooks?.applyFilters) {
        options = window.wp.hooks.applyFilters('surecart_razorpay_checkout_options', options);
      }

      const razorpay = new this.razorpayInstance(options);

      razorpay.on('payment.failed', response => {
        createErrorNotice({
          message: response?.error?.description || __('Payment failed. Please try again.', 'surecart'),
        });
        updateFormState('REJECT');
        console.error('payment.failed', response);
      });

      razorpay.open();
    } catch (err) {
      createErrorNotice(err);
      console.error(err);
      updateFormState('REJECT');
    } finally {
      this.confirming = false;
    }
  }
}
