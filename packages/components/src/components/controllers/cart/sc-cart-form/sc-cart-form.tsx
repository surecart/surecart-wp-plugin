import { Component, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Creator, Universe } from 'stencil-wormhole';

import { convertLineItemsToLineItemData } from '../../../../functions/line-items';
import { createOrUpdateCheckout } from '../../../../services/session';
import { getOrder, setOrder } from '@store/checkouts';
import uiStore from '@store/ui';
import { Checkout, LineItemData } from '../../../../types';

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
  styles: ':host { display: block }',
  shadow: true,
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

  @State() order: Checkout;

  /** Is it busy */
  @State() busy: boolean;
  @State() error: string;

  /** Find a line item with this price. */
  getLineItem() {
    const order = this.getOrder();
    const lineItem = (order?.line_items?.data || []).find(item => item.price?.id === this.priceId);
    if (!lineItem?.id) {
      return false;
    }

    return {
      id: lineItem?.id,
      price_id: lineItem?.price?.id,
      quantity: lineItem?.quantity,
    } as LineItemData;
  }

  getOrder() {
    return getOrder(this?.formId, this.mode);
  }

  /** Add the item to cart. */
  async addToCart() {
    const { price } = await this.form.getFormJson();
    try {
      this.busy = true;
      // if it's ad_hoc, update the amount. Otherwise increment the quantity.
      const order = await this.addOrUpdateLineItem({ ...(!!price ? { ad_hoc_amount: parseInt(price as string) || null } : {}) });
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

  async addOrUpdateLineItem(data: any = {}) {
    // get the current line item from the price id.
    let lineItem = this.getLineItem() as LineItemData;

    // convert line items response to line items post.
    let existingData = convertLineItemsToLineItemData(this.getOrder()?.line_items || []);

    // Line item does not exist. Add it.
    return (await createOrUpdateCheckout({
      id: this.getOrder()?.id,
      data: {
        live_mode: this.mode === 'live',
        line_items: [
          ...(existingData || []).map((item: LineItemData) => {
            // if the price ids match (we have already a line item)
            if (this.priceId === item?.price_id) {
              return {
                ...item,
                ...(!!data?.ad_hoc_amount ? { ad_hoc_amount: data?.ad_hoc_amount } : {}),
                quantity: !!item?.ad_hoc_amount ? item?.quantity + 1 : 1, // only increase quantity if not ad_hoc.
              };
            }
            // return item.
            return item;
          }),
          // add a line item if one does not exist.
          ...(!lineItem
            ? [
                {
                  price_id: this.priceId,
                  ...(!!data?.ad_hoc_amount ? { ad_hoc_amount: data?.ad_hoc_amount } : {}),
                  quantity: 1,
                },
              ]
            : []),
        ],
      },
      query: {
        ...query,
        form_id: this.formId,
      },
    })) as Checkout;
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
