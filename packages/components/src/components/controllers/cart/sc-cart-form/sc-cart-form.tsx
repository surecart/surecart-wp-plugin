import { Component, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Creator, Universe } from 'stencil-wormhole';
import { createOrUpdateOrder } from '../../../../services/session';
import { Order } from '../../../../types';
import { getOrder, setOrder } from '../../../../store/checkouts';
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
  private form: HTMLScFormElement;

  /** The quantity */
  @Prop({ mutable: true }) quantity: number = 1;

  /** The price id to add. */
  @Prop() priceId: string;

  /** Are we in test or live mode. */
  @Prop() mode: 'test' | 'live' = 'live';

  /** The form id to use for the cart. */
  @Prop({ reflect: true }) formId: string;

  @State() order: Order;

  /** Is it busy */
  @State() busy: boolean;
  @State() error: string;

  /** Find a line item with this price. */
  getLineItem() {
    const order = this.getOrder();
    if (!order) return null;
    return (order?.line_items?.data || []).find(item => item.price?.id === this.priceId);
  }

  getOrder() {
    return getOrder(this?.formId, this.mode);
  }

  /** Add the item to cart. */
  async addToCart() {
    const { price } = await this.form.getFormJson();
    try {
      this.busy = true;

      let order;
      if (price) {
        order = await this.addLineItem(parseInt(price as string));
      } else {
        // add line item or increment quantity.
        const lineItem = this.getLineItem();
        order = lineItem ? await this.addQuantity(lineItem) : await this.addLineItem();
      }

      // store the checkout in localstorage and open the cart
      setOrder(order, this.formId);
      uiStore.set('cart', { ...uiStore.state.cart, ...{ open: true } });
    } catch (e) {
      console.error(e);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.busy = false;
    }
  }

  /** Add a new line item. */
  async addLineItem(ad_hoc_amount = null) {
    let existingData = convertLineItemsToLineItemData(this.getOrder()?.line_items || []);
    return (await createOrUpdateOrder({
      id: this.getOrder()?.id,
      data: {
        live_mode: this.mode === 'live',
        line_items: [
          ...(existingData || []),
          {
            price_id: this.priceId,
            quantity: this.quantity,
            ...(ad_hoc_amount ? { ad_hoc_amount } : {}),
          },
        ],
      },
      query: {
        ...query,
        form_id: this.formId,
      },
    })) as Order;
  }

  /** Update a line item quantity */
  async addQuantity(lineItem) {
    let existingData = convertLineItemsToLineItemData(this.getOrder()?.line_items || []);
    return (await createOrUpdateOrder({
      id: this.getOrder()?.id,
      data: {
        live_mode: this.mode === 'live',
        line_items: [
          ...(existingData || []).filter(item => item?.price_id !== lineItem?.price_id),
          {
            price_id: lineItem?.price_id,
            quantity: lineItem?.quantity + 1,
          },
        ],
      },
      query: {
        ...query,
        form_id: this.formId,
      },
    })) as Order;
  }

  componentWillLoad() {
    Universe.create(this as Creator, this.state());
  }

  state() {
    return {
      busy: this.busy,
      error: this.error,
      order: this.getOrder(),
    };
  }

  render() {
    return (
      <sc-form
        ref={el => (this.form = el as HTMLScFormElement)}
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
        <Universe.Provider state={this.state()}>
          <slot />
        </Universe.Provider>
      </sc-form>
    );
  }
}
