/**
 * External dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';
import { Component } from '@stencil/core';

/**
 * Internal dependencies.
 */
import { state as checkoutState } from '@store/checkout';
import { state as selectedProcessor } from '@store/selected-processor';
import { onChange as onChangeFormState } from '@store/form';
import { currentFormState } from '@store/form/getters';
import { updateFormState } from '@store/form/mutations';
import { createErrorNotice } from '@store/notices/mutations';
import { Customer, RazorpayConstructor } from 'src/types';

@Component({
  tag: 'sc-checkout-razorpay-payment-provider',
  shadow: true,
})
export class ScCheckoutRazorpayPaymentProvider {
  private unlistenToFormState: () => void;
  private razorpayInstance: RazorpayConstructor | null = null;

  componentWillLoad() {
    this.loadRazorpay();

    // we need to listen to the form state and pay when the form state enters the paying state.
    this.unlistenToFormState = onChangeFormState('formState', () => {
      // are we paying?
      if ('paying' === currentFormState()) {
        this.confirm();
      }
    });
  }

  disconnectedCallback() {
    this.unlistenToFormState();
  }

  async loadRazorpay(): Promise<void> {
    if (this.razorpayInstance) {
      return;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        this.razorpayInstance = (window as any).Razorpay;
        resolve();
      };
      script.onerror = () => {
        createErrorNotice({ message: __('Failed to load Razorpay script.', 'surecart') });
        reject(new Error(__('Failed to load Razorpay script.', 'surecart')));
      };
      document.head.appendChild(script);
    });
  }

  async confirm() {
    // this processor is not selected.
    if (selectedProcessor?.id !== 'razorpay') return;
    // Must be a razorpay session
    if (!checkoutState?.checkout?.payment_intent?.processor_data?.razorpay) return;
    // Prevent if already paid.
    if (checkoutState?.checkout?.status === 'paid') return;

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
        await this.loadRazorpay();
      }

      if (!this.razorpayInstance) {
        createErrorNotice({ message: __('Razorpay script failed to load. Please try again.', 'surecart') });
        updateFormState('REJECT');
        return;
      }

      const { name, email, phone } = checkoutState?.checkout?.customer as Customer;

      /*
       * Razorpay options.
       * @see https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/#123-checkout-options
       */
      let options = {
        key: public_key,
        order_id: external_intent_id,
        prefill: {
          name,
          email,
          contact: phone,
        },
        customer_id,
        recurring: reusable,
        handler: (response: any) => {
          if (response?.razorpay_payment_id) {
            return updateFormState('PAID');
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
    }
  }
}
