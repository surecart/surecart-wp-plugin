import { Component, h, Prop, Fragment, Host } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { intervalString } from '../../../../functions/price';
import { state } from '@store/product';
import { availablePrices } from '@store/product/getters';

@Component({
  tag: 'sc-product-price-choices',
  styleUrl: 'sc-product-price-choices.css',
  shadow: true,
})
export class ScProductPriceChoices {
  @Prop() label: string;

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
    const prices = availablePrices();
    if (prices?.length < 2) return <Host style={{ display: 'none' }}></Host>;

    return (
      <sc-choices label={this.label} required style={{ '--columns': '2', '--sc-input-required-indicator': ' ' }}>
        {(prices || []).map(price => (
          <sc-price-choice-container
            label={price?.name || state.product?.name}
            price={price}
            checked={state?.selectedPrice?.id === price?.id}
            onScChange={e => {
              if (e.target.checked) {
                state.selectedPrice = price;
              }
            }}
          />
        ))}
      </sc-choices>
    );
  }
}
