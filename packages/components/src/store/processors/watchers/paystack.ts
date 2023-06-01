/**
 * External dependencies.
 */
import PaystackPop from '@paystack/inline-js';

/**
 * Internal dependencies.
 */
import { updateFormState } from '@store/form/mutations';
import { Checkout } from 'src/types';

export const maybeConfirmOrderForPaystack = async (checkoutStatus: string, checkout: Checkout) => {
    // Must be a paystack session
    if (!checkout?.payment_intent?.processor_data.paystack) return;

    // Must have public key for Paystack.
    if (!checkout?.payment_intent?.processor_data?.paystack?.public_key) return;

    // Must have access code, which will be got from server with already created transaction.
    if (!checkout?.payment_intent?.processor_data?.paystack?.access_code) return;

    // Prevent duplicate confirming.
    if (checkoutStatus === 'confirming') return;

    // Prevent if already paid.
    if (checkout?.status === 'paid') return;

    try {
        const { public_key, access_code } = checkout.payment_intent.processor_data.paystack;
        if (!public_key || !access_code) return;

        const paystack = new PaystackPop();
        await paystack.newTransaction({
            'key': public_key,
            'accessCode': access_code, // We'll use accessCode which will handle product, price on our server.
            onSuccess: async (transaction) => {
                if (transaction?.status === 'success') {
                    updateFormState('PAID');
                }
            },
            onCancel: () => {
                throw new Error('Paystack popup cancelled by user.');
            },
        });
    } catch (err) {
        console.error('Paystack transaction could not be finished. Error: ', err);
        updateFormState('FAILURE');
    }
}
