import { Component, h, Prop, Fragment, Host } from '@stencil/core';
import { __, _n, sprintf } from '@wordpress/i18n';
import { Price, Variant } from '../../../../types';
import { state } from '@store/product';
import { state as bumpState } from '@store/bump';
import { intervalString } from '../../../../functions/price';

@Component({
  tag: 'sc-product-price',
  styleUrl: 'sc-product-price.scss',
  shadow: true,
})
export class ScProductPrice {
  /** The product's prices. */
  @Prop() prices: Price[];

  /** The sale text */
  @Prop() saleText: string;

  /** The product id */
  @Prop() productId: string;

  renderRange() {
    if (state[this.productId]?.prices?.length === 1) {
      return this.renderPrice(state[this.productId]?.prices[0]);
    }
    return <sc-price-range prices={state[this.productId]?.prices} />;
  }

  renderVariantPrice(selectedVariant: Variant) {
    const variant = state[this.productId]?.variants?.find(variant => variant?.id === selectedVariant?.id);
    return this.renderPrice(state[this.productId].selectedPrice, variant?.amount);
  }

  // Check if the bump is the same as the product and price matches.
  componentDidLoad() {
    if (bumpState.product?.id !== this.productId) {
      return;
    }

    // If price doesn't match, don't proceed.
    const bumpPrice = bumpState.bump?.price as Price;
    let price = state[this.productId]?.prices.find(priceData => priceData?.id === bumpPrice?.id);
    if (!price) return;

    let amount = price?.amount || 0;
    let initialAmount = bumpPrice?.amount || 0;
    let scratchAmount = initialAmount;

    if (bumpState.bump?.amount_off) {
      amount = Math.max(0, initialAmount - bumpState.bump?.amount_off);
    }

    if (bumpState.bump?.percent_off) {
      const off = initialAmount * (bumpState.bump?.percent_off / 100);
      amount = Math.max(0, initialAmount - off);
    }

    state[this.productId].selectedPrice = {
      ...price,
      amount,
      scratch_amount: scratchAmount,
    };
  }

  renderPrice(price: Price, variantAmount?: number) {
    const amount = variantAmount ?? price?.amount ?? 0;

    if (price?.ad_hoc) {
      return __('Custom Amount', 'surecart');
    }

    return (
      <Fragment>
        <div class="price" id="price">
          <div class="price__amounts">
            {!!price?.scratch_amount && price?.scratch_amount !== amount && (
              <Fragment>
                {price?.scratch_amount === 0 ? (
                  __('Free', 'surecart')
                ) : (
                  <Fragment>
                    <sc-visually-hidden>{__('The price was', 'surecart')} </sc-visually-hidden>
                    <sc-format-number class="price__scratch" part="price__scratch" type="currency" currency={price.currency} value={price?.scratch_amount}></sc-format-number>
                    <sc-visually-hidden> {__('now discounted to', 'surecart')}</sc-visually-hidden>
                  </Fragment>
                )}
              </Fragment>
            )}

            {amount === 0 ? __('Free', 'surecart') : <sc-format-number class="price__amount" type="currency" value={amount} currency={price?.currency}></sc-format-number>}

            <div class="price__interval">
              {price?.recurring_period_count && 1 < price?.recurring_period_count && (
                <sc-visually-hidden>
                  {' '}
                  {__('This is a repeating price. Payment will happen', 'surecart')}{' '}
                  {intervalString(price, {
                    showOnce: true,
                    abbreviate: false,
                    labels: {
                      interval: __('every', 'surecart'),
                      period:
                        /** translators: used as in time period: "for 3 months" */
                        __('for', 'surecart'),
                    },
                  })}
                </sc-visually-hidden>
              )}

              <span aria-hidden="true">
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
              </span>
            </div>

            {!!price?.scratch_amount && (
              <sc-tag type="primary" pill class="price__sale-badge">
                {this.saleText || (
                  <Fragment>
                    <sc-visually-hidden>{__('This product is available for sale.', 'surecart')} </sc-visually-hidden>
                    <span aria-hidden="true">{__('Sale', 'surecart')}</span>
                  </Fragment>
                )}
              </sc-tag>
            )}
          </div>

          {(!!price?.trial_duration_days || (!!price?.setup_fee_enabled && price?.setup_fee_amount)) && (
            <div class="price__details">
              {!!price?.trial_duration_days && (
                <Fragment>
                  <sc-visually-hidden>{sprintf(__('You have a %d-day trial before payment becomes necessary.', 'surecart'), price.trial_duration_days)}</sc-visually-hidden>
                  <span class="price__trial" aria-hidden="true">
                    {sprintf(_n('Starting in %s day.', 'Starting in %s days.', price.trial_duration_days, 'surecart'), price.trial_duration_days)}
                  </span>
                </Fragment>
              )}

              {!!price?.setup_fee_enabled && price?.setup_fee_amount && (
                <span class="price__setup-fee">
                  <sc-visually-hidden>{__('This product has', 'surecart')} </sc-visually-hidden>
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
    return (
      <Host role="paragraph">
        {(() => {
          if (state[this.productId]?.selectedVariant) {
            return this.renderVariantPrice(state[this.productId]?.selectedVariant);
          }

          if (state[this.productId].selectedPrice) {
            return this.renderPrice(state[this.productId].selectedPrice);
          }

          if (state[this.productId].prices.length) {
            return this.renderRange();
          }

          return <slot />;
        })()}
      </Host>
    );
  }
}
