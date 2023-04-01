import { Component, h, Prop, State } from '@stencil/core';
import uiStore from '@store/ui';
import { getCheckout } from '@store/checkouts';

/**
 * @part base - The elements base wrapper.
 * @part count - The icon base wrapper.
 */
@Component({
  tag: 'sc-cart-button',
  styleUrl: 'sc-cart-button.scss',
  shadow: true,
})
export class ScCartButton {
  /** Is this open or closed? */
  @State() open: boolean = null;

  /** The order count */
  @State() count: number = 0;

  /** The icon to show. */
  @Prop() icon: string = 'shopping-bag';

  /** The form id to use for the cart. */
  @Prop({ reflect: true }) formId: string;

  /** Are we in test or live mode. */
  @Prop() mode: 'test' | 'live' = 'live';

  order() {
    return getCheckout(this.formId, this.mode);
  }

  /** Count the number of items in the cart. */
  getItemsCount() {
    const items = this.order()?.line_items?.data;
    let count = 0;
    (items || []).forEach(item => {
      count = count + item?.quantity;
    });
    return count;
  }

  render() {
    return (
      <div class={{ cart_button: true }} part="base">
        {!!this.getItemsCount() && (
          <span class={{ cart_button_count: true }} part="count">
            {this.getItemsCount()}
          </span>
        )}
        <div onClick={() => (uiStore.state.cart.open = !uiStore.state.cart.open)} class={{ cart_button_icon: true }}>
          {this.icon && <sc-icon name={this.icon}></sc-icon>}
        </div>
      </div>
    );
  }
}
