import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addLineItem } from '../../../../services/session';
import { getOrder, setOrder } from '../../../../store/checkouts';
import { state } from '../../../../store/product';
import { toggleCart } from '../../../../store/ui';
import { Checkout } from '../../../../types';

@Component({
  tag: 'sc-product-buy-button',
  styleUrl: 'sc-product-buy-button.css',
  shadow: true,
})
export class ScProductBuyButton {
  /** Is this an add to cart button? */
  @Prop() addToCart: boolean;

  /** Is the order busy */
  @Prop() busy: boolean;

  /** The button type. */
  @Prop({ reflect: true }) type: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'text' | 'link' = 'default';

  /** The button's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Show a full-width button. */
  @Prop() full: boolean = true;

  /** Outline */
  @Prop() outline: boolean = false;

  /** Icon to show. */
  @Prop() icon: string;

  /** Show the total. */
  @Prop() showTotal: boolean;

  getOrder() {
    return getOrder(state?.formId, state.mode);
  }

  handleCartClick(e) {
    if (!this.addToCart) return true;
    e.preventDefault();
    this.addPriceToCart();
  }

  /** Add the item to cart. */
  async addPriceToCart() {
    if (!state.selectedPrice?.id) return;
    try {
      this.busy = true;
      const checkout = await addLineItem({
        checkout: this.getOrder(),
        data: {
          price: state.selectedPrice?.id,
          ad_hoc_amount: state.adHocAmount,
          quantity: state.adHocAmount ? 1 : state.quantity,
        },
        live_mode: state.mode !== 'test',
      });
      setOrder(checkout as Checkout, state.formId);
      toggleCart(true);
    } catch (e) {
      console.error(e);
      state.error = e;
    } finally {
      this.busy = false;
    }
  }

  render() {
    return (
      <sc-button type={this.type} size={this.size} full={this.full} loading={this.busy} disabled={this.busy} outline={this.outline} onClick={e => this.handleCartClick(e)}>
        {!!this.icon && <sc-icon name={this.icon} slot="prefix"></sc-icon>}
        <slot />
      </sc-button>
    );
  }
}
