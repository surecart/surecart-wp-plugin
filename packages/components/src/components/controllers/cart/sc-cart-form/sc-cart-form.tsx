import { Component, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';

import { convertLineItemsToLineItemData } from '../../../../functions/line-items';
import { createOrUpdateCheckout } from '../../../../services/session';
import { state as checkoutState } from '@store/checkout';
import uiStore from '@store/ui';
import { Checkout, LineItemData } from '../../../../types';
import { updateFormState } from '@store/form/mutations';
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
  styles: 'sc-cart-form { display: inline-block }',
  shadow: false,
})
export class ScCartForm {
  private form: HTMLScFormElement;

  /** The quantity */
  @Prop({ mutable: true }) quantity: number = 1;

  /** The price id to add. */
  @Prop() priceId: string;

  /** The variant id to add. */
  @Prop() variantId: string;

  /** Are we in test or live mode. */
  @Prop() mode: 'test' | 'live' = 'live';

  /** The form id to use for the cart. */
  @Prop({ reflect: true }) formId: string;

  /** Is it busy */
  @State() busy: boolean;
  @State() error: string;

  /** Find a line item with this price. */
  getLineItem() {
    const lineItem = (checkoutState?.checkout?.line_items?.data || []).find(item => {
      if (this.variantId) {
        return item.variant?.id === this.variantId && item.price?.id === this.priceId;
      }
      return item.price?.id === this.priceId;
    });
    if (!lineItem?.id) {
      return false;
    }
    return {
      id: lineItem?.id,
      price_id: lineItem?.price?.id,
      quantity: lineItem?.quantity,
    } as LineItemData;
  }

  /** Add the item to cart. */
  async addToCart() {
    const { price } = await this.form.getFormJson();
    try {
      updateFormState('FETCH');
      // if it's ad_hoc, update the amount. Otherwise increment the quantity.
      checkoutState.checkout = await this.addOrUpdateLineItem({
        ...(!!price ? { ad_hoc_amount: parseInt(price as string) || null } : {}),
        ...(!!this.variantId ? { variant_id: (this.variantId as string) || null } : {}),
      });
      updateFormState('RESOLVE');
      // store the checkout in localstorage and open the cart
      uiStore.set('cart', { ...uiStore.state.cart, ...{ open: true } });
    } catch (e) {
      updateFormState('REJECT');
      console.error(e);
      this.error = e?.message || __('Something went wrong', 'surecart');
    }
  }

  async addOrUpdateLineItem(data: any = {}) {
    // get the current line item from the price id.
    let lineItem = this.getLineItem() as LineItemData;

    // convert line items response to line items post.
    let existingData = convertLineItemsToLineItemData(checkoutState?.checkout?.line_items || []);

    // Line item does not exist. Add it.
    return (await createOrUpdateCheckout({
      id: checkoutState?.checkout?.id,
      data: {
        live_mode: this.mode === 'live',
        line_items: [
          ...(existingData || []).map((item: LineItemData) => {
            // if the price ids match (we have already a line item)
            if (this.priceId === item?.price_id) {
              return {
                ...item,
                ...(!!data?.ad_hoc_amount ? { ad_hoc_amount: data?.ad_hoc_amount } : {}),
                ...(!!data?.variant_id ? { variant_id: data?.variant_id } : {}),
                quantity: !item?.ad_hoc_amount ? item?.quantity + 1 : 1, // only increase quantity if not ad_hoc.
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
                  variant_id: this.variantId,
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
        <slot />
      </sc-form>
    );
  }
}
