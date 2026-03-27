import state from './store';
import { clearCheckout as clearSavedCheckout } from '../checkouts/mutations';
import { updateFormState } from '@store/form/mutations';
import { createErrorNotice } from '@store/notices/mutations';
import { addLineItem, removeLineItem, updateLineItem } from '../../services/session';
import apiFetch from '../../functions/fetch';
import { Invoice } from '../../types';
import { addQueryArgs } from '@wordpress/url';

/**
 * Clear the current checkout.
 */
export const clearCheckout = () => {
  clearSavedCheckout(state.formId, state.mode, state.checkout?.id);
};

/**
 * Lock the checkout (disables input and submission)
 * Pass a lock name to prevent conflicts and allow multiple locks.
 */
export const lockCheckout = lockName => (state.locks = [...state.locks, lockName]);

/**
 * Unlock the checkout.
 * Pass an optional lock name to only unlock a specific lock
 */
export const unLockCheckout = (lockName = '') => (state.locks = !!lockName ? state.locks.filter(name => name !== lockName) : []);

/**
 * Update the checkout line item
 */
export const updateCheckoutLineItem = async ({ id, data }) => {
  try {
    updateFormState('FETCH');
    state.checkout = await updateLineItem({
      id: id,
      data,
    });
    updateFormState('RESOLVE');
  } catch (e) {
    console.error(e);
    createErrorNotice(e);
    updateFormState('REJECT');
  }
};

/**
 * Remove the checkout line item.
 */
export const removeCheckoutLineItem = async id => {
  try {
    updateFormState('FETCH');
    state.checkout = await removeLineItem({
      checkoutId: state.checkout.id,
      itemId: id,
    });
    updateFormState('RESOLVE');
  } catch (e) {
    console.error(e);
    createErrorNotice(e);
    updateFormState('REJECT');
  }
};

/**
 * Add the checkout line item.
 */
export const addCheckoutLineItem = async data => {
  try {
    updateFormState('FETCH');
    state.checkout = await addLineItem({
      checkout: state.checkout,
      data,
      live_mode: state?.mode === 'live',
    });
    updateFormState('RESOLVE');
  } catch (e) {
    console.error(e);
    createErrorNotice(e);
    updateFormState('REJECT');
  }
};

/**
 * Track order bump offers.
 */
export const trackOrderBump = (bumpId: string) => {
  if (!state.checkout?.id) {
    return;
  }

  apiFetch({
    path: addQueryArgs(`surecart/v1/checkouts/${state.checkout.id}/offer_bump/${bumpId}`, {
      t: Date.now(),
      ...(!!(state?.checkout?.invoice as Invoice)?.id && { type: 'open_invoice' }),
    }),
    method: 'POST',
    keepalive: true, // Important: allow the request to outlive the page.
  });
};

window.sc = {
  ...(window?.sc || {}),
  checkout: {
    ...(window?.sc?.checkout || {}),
    addLineItem: addCheckoutLineItem,
  },
};
