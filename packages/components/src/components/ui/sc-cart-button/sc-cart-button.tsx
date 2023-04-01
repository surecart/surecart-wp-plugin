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

  render() {
    return (
      <div class={{ cart_button: true }} part="base">
        {!!this.count && (
          <span class={{ cart_button_count: true }} part="count">
            {this.count}
          </span>
        )}
        <div onClick={() => (uiStore.state.cart.open = !uiStore.state.cart.open)} class={{ cart_button_icon: true }}>
          {this.icon && <sc-icon name={this.icon}></sc-icon>}
        </div>
      </div>
    );
  }
}
