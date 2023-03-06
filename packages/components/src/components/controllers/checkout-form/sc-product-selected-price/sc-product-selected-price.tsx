import { Component, Host, h, Prop, Fragment } from '@stencil/core';
import { state as checkoutState } from '@store/checkout';
import { __ } from '@wordpress/i18n';
import { intervalString } from 'src/functions/price';
import { Product } from 'src/types';

@Component({
  tag: 'sc-product-selected-price',
  styleUrl: 'sc-product-selected-price.scss',
  shadow: true,
})
export class ScProductSelectedPrice {
  @Prop() productId: string;

  render() {
    const price = (checkoutState.checkout?.line_items?.data || []).map(line_item => line_item.price).find(price => (price?.product as Product)?.id === this.productId);
    if (!price) return <Host style={{ display: 'none' }}></Host>;
    return (
      <div class="selected-price">
        <span class="selected-price__price">
          {price?.scratch_amount > price.amount && (
            <Fragment>
              <sc-format-number
                class="selected-price__scratch-price"
                part="price__scratch"
                type="currency"
                currency={price?.currency}
                value={price?.scratch_amount}
              ></sc-format-number>{' '}
            </Fragment>
          )}
          <sc-format-number type="currency" currency={price?.currency} value={price?.amount} />
        </span>
        <span class="selected-price__interval">
          {intervalString(price, {
            labels: {
              interval: '/',
              period:
                /** translators: used as in time period: "for 3 months" */
                __('for', 'surecart'),
            },
          })}
        </span>
      </div>
    );
  }
}
