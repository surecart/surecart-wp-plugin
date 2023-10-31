import { Component, h, Prop } from '@stencil/core';
import { state as checkoutState } from '@store/checkout';
import uiStore from '@store/ui';

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

  render() {
    if (!checkoutState?.checkout) {
      return null;
    }
    return (
      <div class={{ cart: true }} part="base" onClick={() => uiStore.set('cart', { ...uiStore.state.cart, ...{ open: !uiStore.state.cart.open } })}>
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
