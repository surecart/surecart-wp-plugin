import state, { onChange, on } from './store';
import { getCheckout, setCheckout } from '../checkouts/mutations';
import { Checkout } from 'src/types';
import { speak } from '@wordpress/a11y';
import { __, sprintf } from '@wordpress/i18n';
import { getFormattedPrice } from '../../functions/price';

/**
 * When the checkout changes, update the
 * checkout in localstorage.
 */
onChange('checkout', val => setCheckout(val, state.formId));

on('get', prop => {
  if (prop === 'checkout') {
    const checkout = getCheckout(state.formId, state.mode);
    if (checkout?.id) {
      state.checkout = checkout;
    }
  }
});

on('set', (key: string, checkout: Checkout, oldCheckout: Checkout) => {
  if (key !== 'checkout') return; // we only care about checkout
  if (checkout.total_amount === oldCheckout.total_amount && checkout.amount_due === oldCheckout.total_amount) return; // we only care about total_amount and amount_due

  const amountDue = getFormattedPrice({ amount: checkout.amount_due, currency: checkout.currency });
  const totalAmount = getFormattedPrice({ amount: checkout.total_amount, currency: checkout.currency });

  speak(sprintf(__('Checkout updated. The total amount for the checkout is %1$s and the amount due is %1$s.', 'surecart'), totalAmount, amountDue));
});
