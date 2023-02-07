import { Component, h, Prop, Fragment, Host } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { intervalString } from '../../../../functions/price';
import state from '../../../../store/product';

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
    if (state?.prices?.length < 2) return <Host style={{ display: 'none' }}></Host>;

    console.log(state.prices);
    return (
      <sc-choices label={this.label} required>
        {(state.prices || []).map(price => (
          <sc-choice
            type="radio"
            checked={state.selectedPrice?.id === price?.id}
            onScChange={e => {
              if (e.target.checked) {
                state.selectedPrice = price;
              }
            }}
          >
            {this.renderPrice(price)}
          </sc-choice>
        ))}
      </sc-choices>
    );
  }
}
