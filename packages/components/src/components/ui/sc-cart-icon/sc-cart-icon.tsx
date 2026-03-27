import { Component, h, Prop } from '@stencil/core';
import { state as checkoutState } from '@store/checkout';
import uiStore from '@store/ui';
import { __, sprintf } from '@wordpress/i18n';

/**
 * @part base - The elements base wrapper.
 * @part container - The container.
 * @part icon__base - The icon base wrapper.
 */
@Component({
  tag: 'sc-cart-icon',
  styleUrl: 'sc-cart-icon.scss',
  shadow: true,
})
export class ScCartIcon {
  /** The icon to show. */
  @Prop() icon: string = 'shopping-bag';

  /** Count the number of items in the cart. */
  getItemsCount() {
    const items = checkoutState?.checkout?.line_items?.data;
    let count = 0;
    (items || []).forEach(item => {
      count = count + item?.quantity;
    });
    return count;
  }

  /** Toggle the cart in the ui. */
  toggleCart() {
    return uiStore.set('cart', { ...uiStore.state.cart, ...{ open: !uiStore.state.cart.open } });
  }

  render() {
    if (!checkoutState?.checkout || checkoutState?.checkout?.line_items?.data?.length === 0) {
      return null;
    }
    return (
      <div
        class={{
          cart: true,
        }}
        part="base"
        onClick={() => this.toggleCart()}
        onKeyDown={e => {
          if ('Enter' === e?.code || 'Space' === e?.code) {
            this.toggleCart();
            e.preventDefault();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={!uiStore.state.cart.open ? sprintf(__('Open Cart Floating Icon with %d items', 'surecart'), this.getItemsCount()) : __('Close Cart Floating Icon', 'surecart')}
      >
        <div class="cart__container" part="container">
          <div class={{ cart__counter: true }}>{this.getItemsCount()}</div>
          <slot>
            <sc-icon exportparts="base:icon__base" name={this.icon}></sc-icon>
          </slot>
        </div>
      </div>
    );
  }
}
