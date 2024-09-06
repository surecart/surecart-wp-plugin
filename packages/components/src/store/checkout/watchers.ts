import state, { onChange, on } from './store';
import { getCheckout, setCheckout } from '../checkouts/mutations';
import { Checkout, Price, Product } from '../../types';
import { speak } from '@wordpress/a11y';
import { __, sprintf } from '@wordpress/i18n';
import { getFormattedPrice, getHumanDiscount } from '../../functions/price';
import { trackOrderBump } from './mutations';

/**
 * When the checkout changes, update the
 * checkout in localstorage.
 */
onChange('checkout', val => setCheckout(val, state.formId));

/**
 * When checkout is get, get the checkout from the checkouts state.
 */
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
  if (!oldCheckout || !checkout) return; // checkout was not updated.
  if (checkout?.total_amount === oldCheckout?.total_amount && checkout?.amount_due === oldCheckout?.total_amount) return; // we only care about total_amount and amount_due

  const amountDue = getFormattedPrice({
    amount: checkout.amount_due,
    currency: checkout.currency,
  });
  const totalAmount = getFormattedPrice({
    amount: checkout.total_amount,
    currency: checkout.currency,
  });

  const couponCodeAdded = checkout?.discount?.promotion?.code !== oldCheckout?.discount?.promotion?.code && checkout?.discount?.promotion?.code;
  const couponCodeRemoved = checkout?.discount?.promotion?.code !== oldCheckout?.discount?.promotion?.code && !checkout?.discount?.promotion?.code;

  const messages = [
    ...(couponCodeRemoved ? [__('Coupon code removed.', 'sc-coupon-form')] : []),
    ...(couponCodeAdded
      ? [
          sprintf(
            // Translators: %1$s is the coupon code, %2$s is the human readable discount.
            __('Coupon code %1$s added. %2$s applied.', 'sc-coupon-form'),
            checkout?.discount?.promotion?.code,
            getHumanDiscount(checkout?.discount?.coupon),
          ),
        ]
      : []),
    checkout.total_amount === checkout.amount_due
      ? sprintf(__('Checkout updated. The amount due is %1$s.', 'surecart'), amountDue)
      : sprintf(__('Checkout updated. The total amount for the checkout is %1$s and the amount due is %1$s.', 'surecart'), totalAmount, amountDue),
  ];

  speak(messages.join(' '));
});

/**
 * Track order bump offers.
 */
on('set', (key: string, checkout: Checkout, oldCheckout: Checkout) => {
  if (key !== 'checkout') return; // we only care about checkout
  if (!oldCheckout || !checkout) return; // checkout was not updated.

  const bumps = (checkout?.recommended_bumps?.data || []).filter(bump => ((bump?.price as Price)?.product as Product)?.variants?.pagination?.count === 0); // exclude variants for now.;
  if (!bumps?.length) return;

  bumps.forEach(bump => trackOrderBump(bump?.id));
});
