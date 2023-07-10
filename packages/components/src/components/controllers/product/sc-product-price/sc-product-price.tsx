import { Component, h, Prop, Fragment } from '@stencil/core';
import { __, _n, sprintf } from '@wordpress/i18n';
import { Price } from '../../../../types';
import { state } from '@store/product';

@Component({
  tag: 'sc-product-price',
  styleUrl: 'sc-product-price.css',
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

  renderRecurringInterval(price: Price) {
    if (!price?.recurring_interval) return;

    return (
      <span class="recurring-interval">
        / {price.recurring_period_count > 1 && `${price.recurring_period_count} ` }
        {price.recurring_interval + _n('', 's', price.recurring_period_count, 'surecart')}
        {price.recurring_interval_count > 1 ? sprintf(__('(%s payments)', 'surecart'), price.recurring_interval_count) : ''}
      </span>
    );
  }

  renderSetupFee(price: Price) {
    if (!price?.setup_fee_enabled) return;

    return (
      <div class="setup-fee">
        +<sc-format-number type="currency" currency={price.currency} value={price.setup_fee_amount}></sc-format-number> {price.setup_fee_name || __('Setup Fee', 'surecart')}.{' '}
        { !!price.trial_duration_days
          ? sprintf(_n('Starting in %s day', 'Starting in %s days', price.trial_duration_days, 'surecart'), price.trial_duration_days)
          : ''}
      </div>
    );
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
        <div>
          <div class="price">
            {!!price?.scratch_amount && (
              <sc-format-number class="scratch-price" part="price__scratch" type="currency" currency={price.currency} value={price.scratch_amount}></sc-format-number>
            )}
            <sc-format-number type="currency" value={price?.amount} currency={price?.currency} />
            {this.renderRecurringInterval(price)}
            {!!price?.scratch_amount && (
              <sc-tag type="primary" pill class="sale-badge">
                {this.saleText || __('Sale', 'surecart')}
              </sc-tag>
            )}
          </div>
          {this.renderSetupFee(price)}
        </div>
      </Fragment>
    );
  }

  render() {
    if (state.selectedPrice) {
      return this.renderPrice(state.selectedPrice);
    }

    if (state.prices.length) {
      return this.renderRange();
    }

    return <slot />;
  }
}
