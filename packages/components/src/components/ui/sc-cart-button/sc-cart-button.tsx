import { Component, Element, h, Prop, State } from '@stencil/core';
import uiStore from '@store/ui';
import store, { getCheckout } from '@store/checkouts';

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
  private link: HTMLAnchorElement;
  /** The cart element. */
  @Element() el: HTMLScCartButtonElement;

  /** Is this open or closed? */
  @State() open: boolean = null;

  /** The order count */
  @State() count: number = 0;

  /** The form id to use for the cart. */
  @Prop({ reflect: true }) formId: string;

  /** Are we in test or live mode. */
  @Prop() mode: 'test' | 'live' = 'live';

  /** Whether the cart icon is always shown when the cart is empty */
  @Prop() cartMenuAlwaysShown: boolean = true;

  /** Whether the cart count will be shown or not when the cart is empty */
  @Prop() showEmptyCount: boolean = false;

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

  componentDidLoad() {
    this.link = this.el.closest('a');
    // this is to keep the structure that WordPress expects for theme styling.
    this.link.addEventListener('click', e => {
      e.preventDefault();
      e.stopImmediatePropagation();
      uiStore.state.cart = { ...uiStore.state.cart, open: !uiStore.state.cart.open };
      return false;
    });

    // maybe hide the parent <a> if there are no items in the cart.
    this.handleParentLinkDisplay();
    store.onChange(this.mode, () => this.handleParentLinkDisplay());
  }

  handleParentLinkDisplay() {
    this.link.style.display = !this.cartMenuAlwaysShown && !this.getItemsCount() ? 'none' : null;
  }

  render() {
    return (
      <div class="cart__button" part="base">
        <div class="cart__content">
          {(this.showEmptyCount || !!this.getItemsCount()) && (
            <span class="cart__count" part="count">
              {this.getItemsCount()}
            </span>
          )}
          <div class="cart__icon">
            <slot />
          </div>
        </div>
      </div>
    );
  }
}
