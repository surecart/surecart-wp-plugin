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
import { loadRazorpay } from 'src/functions/razorpay';
import { Customer, RazorpayConstructor } from 'src/types';

@Component({
  tag: 'sc-checkout-razorpay-payment-provider',
  shadow: true,
})
export class ScCheckoutRazorpayPaymentProvider {
  private unlistenToFormState?: () => void;
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
  }

  disconnectedCallback() {
    // Guarded: Stencil can disconnect before componentWillLoad fires if the element is reparented
    // mid-render (e.g. when the Razorpay recurring tiles flip from combined → split after the
    // payment_method_types fetch resolves). Calling an undefined listener would crash and wedge
    // sc-payment in a render loop.
    this.unlistenToFormState?.();
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
