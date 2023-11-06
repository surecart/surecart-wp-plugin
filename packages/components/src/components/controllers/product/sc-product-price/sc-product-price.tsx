import { Component, h, Prop, Fragment, Host } from '@stencil/core';
import { __, _n, sprintf } from '@wordpress/i18n';
import { Price } from '../../../../types';
import { state } from '@store/product';
import { intervalString } from '../../../../functions/price';

@Component({
  tag: 'sc-product-price',
  styleUrl: 'sc-product-price.scss',
  shadow: true,
})
export class ScProductPrice {
  @Prop() prices: Price[];
  @Prop() saleText: string;

  renderRange() {
    if (state.prices.length === 1) {
      return this.renderPrice(state.prices[0]);
    }
    return <sc-price-range prices={state.prices} />;
  }

  renderPrice(price: Price) {
    if (price?.ad_hoc) {
      return __('Custom Amount', 'surecart');
    }

    if (price?.amount === 0) {
      return __('Free', 'surecart');
    }

    return (
      <Fragment>
        <div class="price" id="price">
          <div class="price__amounts">
            {!!price?.scratch_amount && (
              <sc-format-number
                aria-label={__('Original price', 'surecart')}
                class="price__scratch"
                part="price__scratch"
                type="currency"
                currency={price.currency}
                value={price.scratch_amount}
              ></sc-format-number>
            )}

            <sc-format-number aria-label={__('Sale Price', 'surecart')} class="price__amount" type="currency" value={price?.amount} currency={price?.currency}></sc-format-number>

            <div class="price__interval">
              {intervalString(price, {
                showOnce: true,
                abbreviate: false,
                labels: {
                  interval: '/',
                  period:
                    /** translators: used as in time period: "for 3 months" */
                    __('for', 'surecart'),
                },
              })}
            </div>

            {!!price?.scratch_amount && (
              <sc-tag type="primary" pill class="price__sale-badge">
                {this.saleText || __('Sale', 'surecart')}
              </sc-tag>
            )}
          </div>

          {(!!price?.trial_duration_days || (!!price?.setup_fee_enabled && price?.setup_fee_amount)) && (
            <div class="price__details">
              {!!price?.trial_duration_days && (
                <span class="price__trial">{sprintf(_n('Starting in %s day.', 'Starting in %s days.', price.trial_duration_days, 'surecart'), price.trial_duration_days)} </span>
              )}

              {!!price?.setup_fee_enabled && price?.setup_fee_amount && (
                <span class="price__setup-fee">
                  <sc-format-number type="currency" value={price.setup_fee_amount} currency={price?.currency}></sc-format-number>{' '}
                  {price?.setup_fee_name || __('Setup Fee', 'surecart')}.
                </span>
              )}
            </div>
          )}
        </div>
      </Fragment>
    );
  }

  render() {
    return <Host role="paragraph">{state.selectedPrice ? this.renderPrice(state.selectedPrice) : state.prices.length ? this.renderRange() : <slot />}</Host>;
  }
}
