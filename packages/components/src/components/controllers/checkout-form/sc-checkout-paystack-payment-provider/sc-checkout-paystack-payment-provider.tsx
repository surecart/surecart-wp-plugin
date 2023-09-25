/**
 * External dependencies.
 */
import PaystackPop from '@paystack/inline-js';
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

@Component({
  tag: 'sc-checkout-paystack-payment-provider',
  shadow: true,
})
export class ScCheckoutPaystackPaymentProvider {
  private unlistenToFormState: () => void;

  componentWillLoad() {
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

  async confirm() {
    // this processor is not selected.
    if (selectedProcessor?.id !== 'paystack') return;
    // Must be a paystack session
    if (!checkoutState?.checkout?.payment_intent?.processor_data.paystack) return;
    // Prevent if already paid.
    if (checkoutState?.checkout?.status === 'paid') return;

    try {
      // must have a public key and access code.
      const { public_key, access_code } = checkoutState?.checkout?.payment_intent.processor_data.paystack;
      if (!public_key || !access_code) {
        createErrorNotice({ message: sprintf(__('Payment gateway configuration incomplete. Please ensure Paystack is properly configured for transactions.', 'surecart')) });
        return;
      }

      const paystack = new PaystackPop();

      await paystack.newTransaction({
        key: public_key,
        accessCode: access_code, // We'll use accessCode which will handle product, price on our server.
        onSuccess: async transaction => {
          if (transaction?.status !== 'success') {
            throw { message: sprintf(__('Paystack transaction could not be finished. Status: %s', 'surecart'), transaction?.status) };
          }
          return updateFormState('PAID');
        },
        onClose: () => updateFormState('REJECT'),
      });
    } catch (err) {
      createErrorNotice(err);
      console.error(err);
      updateFormState('REJECT');
    }
  }
}
