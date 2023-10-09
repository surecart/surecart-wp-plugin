import { Component, h, Prop } from '@stencil/core';
import { getOrder } from '@store/checkouts';
import uiStore from '@store/ui';
import { __ } from '@wordpress/i18n';

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

  /** The count to show in the cart icon. */
  @Prop() count: number = 0;

  /** The form id to use for the cart. */
  @Prop({ reflect: true }) formId: string;

  /** Are we in test or live mode. */
  @Prop() mode: 'test' | 'live' = 'live';

  order() {
    return getOrder(this.formId, this.mode);
  }

  /** Cart focus */
  @Prop({ mutable: true, reflect: true }) hasFocus: boolean;

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
    if (!this.order()) {
      return null;
    }
    return (
      <div
        class={{
          'cart': true,
          'cart--focused': this.hasFocus,
        }}
        part="base"
        onClick={() => uiStore.set('cart', { ...uiStore.state.cart, ...{ open: !uiStore.state.cart.open } })}
        onKeyDown={e => {
          if ('Enter' === e?.code || 'Space' === e?.code) {
            uiStore.set('cart', { ...uiStore.state.cart, ...{ open: !uiStore.state.cart.open } });
          }
        }}
        onFocus={() => {
          this.hasFocus = true;
        }}
        onBlur={() => {
          this.hasFocus = false;
        }}
        tabIndex={0}
        role="button"
        aria-label={__('Open Cart', 'surecart')}
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
