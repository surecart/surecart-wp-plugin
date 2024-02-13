import { on } from './store';
import {state as checkoutState} from '@store/checkout';

import { Checkout, LineItem } from 'src/types';
// import { maybeConvertAmount } from '../../functions/currency';

// Listen to all stored checkouts and handle line item changes.
on('set', (_, value, oldValue) => Object.keys(value || {}).forEach(key => handleCheckoutLineItemChange(value[key] as Checkout, oldValue?.[key])));

/**
 * Add to cart/remove from cart, cart updated events.
 */
export const handleCheckoutLineItemChange = (checkout: Checkout, oldCheckout: Checkout) => {
  // get new and old line items.
  const newLineItems = (checkout as Checkout)?.line_items?.data || [];
  const oldLineItems = (oldCheckout as Checkout)?.line_items?.data || [];

  // check for added items or quantity changed
  newLineItems.forEach(newItem => {
    const oldItem = oldLineItems.find(item => item.id === newItem.id);
    // an item was added, or the quantity changed.
    if (!oldItem || oldItem?.quantity < newItem?.quantity) {
      const event = new CustomEvent<LineItem>('scAddedToCart', {
        detail: {
          ...newItem,
          quantity: newItem.quantity - (oldItem?.quantity || 0),
        },
        bubbles: true,
      });
      document.dispatchEvent(event);
    }
  });

  // check for removed items or quantity changed
  oldLineItems.forEach(oldItem => {
    const newItem = newLineItems.find(item => item.id === oldItem.id);
    // an item was removed, or the quantity changed.
    if (!newItem || oldItem?.quantity > newItem?.quantity) {
      const event = new CustomEvent<LineItem>('scRemovedFromCart', {
        detail: {
          ...oldItem,
          quantity: oldItem.quantity - (newItem?.quantity || 0),
        },
        bubbles: true,
      });
      document.dispatchEvent(event);
    }
  });

  // check if line items have changed.
  if (!checkoutState?.isCheckoutPage && JSON.stringify(newLineItems) !== JSON.stringify(oldLineItems)) {
    // emit an event here with the checkout state updates.
    const event = new CustomEvent<{ currentCart: Checkout; previousCart: Checkout }>('scCartUpdated', {
      detail: {
        currentCart: checkout,
        previousCart: oldCheckout,
      },
      bubbles: true,
    });
    document.dispatchEvent(event);
  }
};
