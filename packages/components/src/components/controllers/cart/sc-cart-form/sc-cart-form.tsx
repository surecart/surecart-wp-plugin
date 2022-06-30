import { Component, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { createOrUpdateOrder } from '../../../../services/session';
import { Order } from '../../../../types';
import store from '../../../../store/checkouts';
import uiStore from '../../../../store/ui';
import { convertLineItemsToLineItemData } from '../../../../functions/line-items';
const query = {
  expand: [
    'line_items',
    'line_item.price',
    'price.product',
    'customer',
    'customer.shipping_address',
    'payment_intent',
    'discount',
    'discount.promotion',
    'discount.coupon',
    'shipping_address',
    'tax_identifier',
  ],
};

@Component({
  tag: 'sc-cart-form',
  styleUrl: 'sc-cart-form.scss',
  shadow: false,
})
export class ScCartForm {
  /** The quantity */
  @Prop({ mutable: true }) quantity: number = 1;

  /** The price id to add. */
  @Prop() priceId: string;

  /** The form id to use for the cart. */
  @Prop({ reflect: true }) formId: string;

  @State() order: Order;

  /** Is it busy */
  @State() busy: boolean;
  @State() error: string;

  /** Find a line item with this price. */
  getLineItem() {
    const order = store?.state?.checkouts?.[this?.formId];
    if (!order) return null;
    return (order?.line_items?.data || []).find(item => item.price?.id === this.priceId);
  }

  /** Add the item to cart. */
  async addToCart() {
    try {
      this.busy = true;

      // add line item or increment quantity.
      const lineItem = this.getLineItem();
      const order = lineItem ? await this.addQuantity(lineItem) : await this.addLineItem();

      // store the checkout in localstorage and open the cart
      store.set('checkouts', { ...store.state.checkouts, [this.formId]: order });
      uiStore.set('cart', { ...uiStore.state.cart, ...{ open: true } });
    } catch (e) {
      console.error(e);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.busy = false;
    }
  }

  /** Add a new line item. */
  async addLineItem() {
    let existingData = convertLineItemsToLineItemData(store?.state?.checkouts?.[this?.formId]?.line_items || []);
    return (await createOrUpdateOrder({
      id: store?.state?.checkouts?.[this?.formId]?.id,
      data: {
        line_items: [
          ...(existingData || []),
          {
            price_id: this.priceId,
            quantity: this.quantity,
          },
        ],
      },
      query,
    })) as Order;
  }

  /** Update a line item quantity */
  async addQuantity(lineItem) {
    let existingData = convertLineItemsToLineItemData(store?.state?.checkouts?.[this?.formId]?.line_items || []);
    return (await createOrUpdateOrder({
      id: store?.state?.checkouts?.[this?.formId]?.id,
      data: {
        line_items: [
          ...(existingData || []).filter(item => item?.price_id !== lineItem?.price_id),
          {
            price_id: lineItem?.price_id,
            quantity: lineItem?.quantity + 1,
          },
        ],
      },
      query,
    })) as Order;
  }

  render() {
    return (
      <sc-form
        onScSubmit={() => {
          this.addToCart();
        }}
      >
        {this.error && (
          <sc-alert open={!!this.error} type="danger">
            <span slot="title">{__('Error', 'surecart')}</span>
            {this.error}
          </sc-alert>
        )}
        <slot />
        <sc-button type="primary" submit busy={this.busy}>
          {__('Add To Cart', 'surecart')}
        </sc-button>
      </sc-form>
    );
  }
}
