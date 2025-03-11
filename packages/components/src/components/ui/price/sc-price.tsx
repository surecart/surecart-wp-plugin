/**
 * External dependencies.
 */
import { Component, h, Prop, Fragment, Host } from '@stencil/core';
import { __, _n, sprintf } from '@wordpress/i18n';
import { intervalString } from '../../../functions/price';

/**
 * Internal dependencies.
 */

@Component({
  tag: 'sc-price',
  styleUrl: 'sc-price.scss',
  shadow: true,
})
export class ScProductPrice {
  /** The currency. */
  @Prop() currency: string;

  /** The amount */
  @Prop() amount: number;

  /** The scratch amount */
  @Prop() scratchAmount: number;

  /** The scratch display amount */
  @Prop() scratchDisplayAmount: string;

  /** The display amount */
  @Prop() displayAmount: string;

  /** The sale text */
  @Prop() saleText: string;

  /** Is the product ad_hoc? */
  @Prop() adHoc: boolean;

  /** The recurring period count */
  @Prop() recurringPeriodCount: number;

  /** The recurring interval count */
  @Prop() recurringIntervalCount: number;

  /** The recurring interval */
  @Prop() recurringInterval: 'week' | 'month' | 'year' | 'never';

  /** The setup fee amount */
  @Prop() setupFeeAmount: number;

  /** The trial duration days */
  @Prop() trialDurationDays: number;

  /** The setup fee name */
  @Prop() setupFeeName: string;

  render() {
    if (this.adHoc) {
      return <Host role="paragraph">{__('Custom Amount', 'surecart')}</Host>;
    }

    return (
      <Host role="paragraph">
        <div class="price" id="price">
          <div class="price__amounts">
            {!!this.scratchAmount && this.scratchAmount !== this.amount && (
              <Fragment>
                {this.scratchAmount === 0 ? (
                  __('Free', 'surecart')
                ) : (
                  <Fragment>
                    <sc-visually-hidden>{__('The price was', 'surecart')} </sc-visually-hidden>
                    {!!this.scratchDisplayAmount ? (
                      <span class="price__scratch">{this.scratchDisplayAmount}</span>
                    ) : (
                      <sc-format-number class="price__scratch" part="price__scratch" type="currency" currency={this.currency} value={this.scratchAmount}></sc-format-number>
                    )}
                    <sc-visually-hidden> {__('now discounted to', 'surecart')}</sc-visually-hidden>
                  </Fragment>
                )}
              </Fragment>
            )}

            {this.amount === 0 ? (
              __('Free', 'surecart')
            ) : this.displayAmount ? (
              this.displayAmount
            ) : (
              <sc-format-number class="price__amount" type="currency" value={this.amount} currency={this.currency}></sc-format-number>
            )}

            <div class="price__interval">
              {this.recurringPeriodCount && 1 < this.recurringPeriodCount && (
                <sc-visually-hidden>
                  {' '}
                  {__('This is a repeating price. Payment will happen', 'surecart')}{' '}
                  {intervalString(
                    {
                      recurring_interval_count: this.recurringIntervalCount,
                      recurring_interval: this.recurringInterval,
                      recurring_period_count: this.recurringPeriodCount,
                    },
                    {
                      showOnce: true,
                      abbreviate: false,
                      labels: {
                        interval: __('every', 'surecart'),
                        period:
                          /** translators: used as in time period: "for 3 months" */
                          __('for', 'surecart'),
                      },
                    },
                  )}
                </sc-visually-hidden>
              )}

              <span aria-hidden="true">
                {intervalString(
                  {
                    recurring_interval_count: this.recurringIntervalCount,
                    recurring_interval: this.recurringInterval,
                    recurring_period_count: this.recurringPeriodCount,
                  },
                  {
                    showOnce: true,
                    abbreviate: false,
                    labels: {
                      interval: '/',
                      period:
                        /** translators: used as in time period: "for 3 months" */
                        __('for', 'surecart'),
                    },
                  },
                )}
              </span>
            </div>

            {!!this.scratchAmount && (
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

          {(!!this?.trialDurationDays || !!this?.setupFeeAmount) && (
            <div class="price__details">
              {!!this?.trialDurationDays && (
                <Fragment>
                  <sc-visually-hidden>{sprintf(__('You have a %d-day trial before payment becomes necessary.', 'surecart'), this?.trialDurationDays)}</sc-visually-hidden>
                  <span class="price__trial" aria-hidden="true">
                    {sprintf(_n('Starting in %s day.', 'Starting in %s days.', this?.trialDurationDays, 'surecart'), this?.trialDurationDays)}
                  </span>
                </Fragment>
              )}

              {!!this?.setupFeeAmount && (
                <span class="price__setup-fee">
                  <sc-visually-hidden>{__('This product has', 'surecart')} </sc-visually-hidden>{' '}
                  <sc-format-number type="currency" value={this?.setupFeeAmount} currency={this.currency}></sc-format-number> {this?.setupFeeName || __('Setup Fee', 'surecart')}.
                </span>
              )}
            </div>
          )}
        </div>
      </Host>
    );
  }
}
