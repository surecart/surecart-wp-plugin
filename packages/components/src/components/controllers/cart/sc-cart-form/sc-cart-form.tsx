import { Component, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { createOrUpdateOrder } from '../../../../services/session';
import { Order } from '../../../../types';
import store from '../../../../store/checkouts';
import uiStore from '../../../../store/ui';

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

  getLineItem(price_id) {
    return (this.order?.line_items?.data || []).find(item => item.price?.id === price_id);
  }

  /**
   * Add the item to cart.
   */
  async addToCart() {
    try {
      this.busy = true;
      const order = (await createOrUpdateOrder({
        id: this.order?.id,
        data: {
          line_items: [
            {
              price_id: this.priceId,
              quantity: this.quantity,
            },
          ],
        },
        query: {
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
        },
      })) as Order;
      store.state.checkouts = {
        ...store.state.checkouts,
        [this.formId]: order,
      };
      uiStore.state.cart.open = true;
    } catch (e) {
      console.error(e);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.busy = false;
    }
  }

  render() {
    return (
      <sc-form
        onScSubmit={() => {
          console.log('submit');
          this.addToCart();
        }}
      >
        {this.error && (
          <sc-alert open={!!this.error} type="danger">
            <span slot="title">{__('Error', 'surecart')}</span>
            {this.error}
          </sc-alert>
        )}
        <sc-model-cache-provider
          cacheKey={`sc-checkout-order-${this?.formId}`}
          model={this.order}
          onScUpdateModel={e => (this.order = e.detail as Order)}
        ></sc-model-cache-provider>
        <slot />
      </sc-form>
    );
  }
}
