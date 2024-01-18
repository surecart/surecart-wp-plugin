import { on } from './store';
import { on as onUIChange } from '@store/ui';
import { state as checkoutState } from '@store/checkout';
import { Checkout, LineItem } from 'src/types';

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
  if (JSON.stringify(newLineItems) !== JSON.stringify(oldLineItems)) {
    // emit an event here with the checkout state updates.
    const event = new CustomEvent<[Checkout, Checkout]>('scCartUpdated', {
      detail: [checkout, oldCheckout],
      bubbles: true,
    });
    document.dispatchEvent(event);
  }
};

/**
 * Handle view cart event.
 */
onUIChange('set', (key: string, newValue: { open: boolean }, oldValue: { open: boolean }) => {
  if (key !== 'cart') return; // we only care about cart.
  if (newValue?.open === oldValue?.open) return; // we only care about open state changes.

  if (newValue?.open) {
    const event = new CustomEvent('scViewedCart', {
      detail: checkoutState.checkout,
      bubbles: true,
    });
    document.dispatchEvent(event);
  }
});
