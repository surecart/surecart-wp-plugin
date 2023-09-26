import { Component, h, Prop, Fragment, Host } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { intervalString } from '../../../../functions/price';
import { state } from '@store/product';
import { availablePrices } from '@store/product/getters';
import { setProduct } from '@store/product/setters';

@Component({
  tag: 'sc-product-price-choices',
  styleUrl: 'sc-product-price-choices.css',
  shadow: true,
})
export class ScProductPriceChoices {
  /** The product price choice label */
  @Prop() label: string;

  /** Whether to show the price */
  @Prop() showPrice: boolean;

  /** The product id */
  @Prop() productId: string;

  renderPrice(price) {
    return (
      <Fragment>
        <sc-format-number type="currency" value={price.amount} currency={price.currency}></sc-format-number>
        <span slot="per">
          {intervalString(price, {
            labels: {
              interval: __('Every', 'surecart'),
              period: __('for', 'surecart'),
              once: __('Once', 'surecart'),
            },
            showOnce: true,
          })}
        </span>
      </Fragment>
    );
  }

  render() {
    const prices = availablePrices(this.productId);
    if (prices?.length < 2) return <Host style={{ display: 'none' }}></Host>;

    return (
      <sc-choices label={this.label} required style={{ '--sc-input-required-indicator': ' ' }}>
        {(prices || []).map(price => (
          <sc-price-choice-container
            label={price?.name || state[this.productId]?.product?.name}
            showPrice={!!this.showPrice}
            price={price}
            checked={state[this.productId]?.selectedPrice?.id === price?.id}
            onScChange={e => {
              if (e.target.checked) {
                setProduct(this.productId, { selectedPrice: price })
              }
            }}
          />
        ))}
      </sc-choices>
    );
  }
}
