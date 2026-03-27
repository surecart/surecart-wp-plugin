import { Component, Event, EventEmitter, Fragment, h, Prop, State, Watch } from '@stencil/core';
import { __, sprintf, _n } from '@wordpress/i18n';
import { Price } from 'src/types';

import { intervalString } from '../../../functions/price';

@Component({
  tag: 'sc-price-choice-container',
  styleUrl: 'sc-price-choice-container.scss',
  shadow: false,
})
export class ScPriceChoiceContainer {
  /** Stores the price */
  @Prop() price: string | Price;

  /** Is this loading */
  @Prop() loading: boolean = false;

  /** Label for the choice. */
  @Prop() label: string;

  /** Show the label */
  @Prop() showLabel: boolean = true;

  /** Show the price amount */
  @Prop() showPrice: boolean = true;

  /** Show the radio/checkbox control */
  @Prop() showControl: boolean = false;

  /** Label for the choice. */
  @Prop() description: string;

  /** Choice Type */
  @Prop() type: 'checkbox' | 'radio';

  @Prop() required: boolean = false;

  /** Is this checked by default */
  @Prop({ reflect: true, mutable: true }) checked: boolean = false;

  @State() priceData: Price;

  @Event() scChange: EventEmitter<void>;

  @Watch('price')
  handlePriceChange() {
    this.priceData = typeof this.price === 'string' ? JSON.parse(this.price) : this.price;
  }
  componentWillLoad() {
    this.handlePriceChange();
  }

  renderPrice() {
    return (
      <Fragment>
        {this.priceData?.display_amount}
        {intervalString(this.priceData, {
          showOnce: true,
          abbreviate: true,
          labels: {
            interval: '/',
            period:
              /** translators: used as in time period: "for 3 months" */
              __('for', 'surecart'),
          },
        })}
      </Fragment>
    );
  }

  render() {
    if (this.loading) {
      return (
        <sc-choice-container showControl={this.showControl} name="loading" disabled>
          <div class="price-choice">
            <sc-skeleton style={{ width: '60px', display: 'inline-block' }}></sc-skeleton>
            <sc-skeleton style={{ width: '80px', display: 'inline-block' }}></sc-skeleton>
          </div>
        </sc-choice-container>
      );
    }

    return (
      <sc-choice-container
        value={this.priceData?.id}
        type={this.type}
        showControl={this.showControl}
        checked={this.checked}
        onScChange={() => this.scChange.emit()}
        required={this.required}
      >
        <div class="price-choice">
          {this.showLabel && (
            <div class="price-choice__title">
              <div class="price-choice__name">{this.label || this.priceData.name}</div>
              {!!this.description && <div class="price-choice__description">{this.description}</div>}
            </div>
          )}

          {this.showPrice && (
            <div class="price-choice__details">
              <div class="price-choice__price">
                {this.priceData?.ad_hoc ? (
                  __('Custom Amount', 'surecart')
                ) : (
                  <Fragment>
                    {this.priceData?.display_amount}
                    {this.priceData?.recurring_period_count && 1 <= this.priceData?.recurring_period_count && (
                      <sc-visually-hidden>
                        {' '}
                        {__('This is a repeating price. Payment will happen', 'surecart')}{' '}
                        {intervalString(this.priceData, {
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
                      {intervalString(this.priceData, {
                        showOnce: true,
                        abbreviate: true,
                        labels: {
                          interval: '/',
                          period:
                            /** translators: used as in time period: "for 3 months" */
                            __('for', 'surecart'),
                        },
                      })}
                    </span>
                  </Fragment>
                )}
              </div>

              {!!this.priceData?.trial_duration_days && (
                <Fragment>
                  <sc-visually-hidden>
                    {sprintf(__('You have a %d-day trial before payment becomes necessary.', 'surecart'), this.priceData?.trial_duration_days)}
                  </sc-visually-hidden>
                  <div class="price-choice__trial" aria-hidden="true">
                    {sprintf(_n('Starting in %s day', 'Starting in %s days', this.priceData.trial_duration_days, 'surecart'), this.priceData.trial_duration_days)}
                  </div>
                </Fragment>
              )}

              {!!this.priceData?.setup_fee_enabled && this.priceData?.setup_fee_amount && (
                <div class="price-choice__setup-fee">
                  <sc-visually-hidden>{__('This payment plan has', 'surecart')} </sc-visually-hidden>
                  {this.priceData?.setup_fee_display_amount}{' '}
                  {this.priceData?.setup_fee_name || (this.priceData?.setup_fee_amount < 0 ? __('Discount', 'surecart') : __('Setup Fee', 'surecart'))}
                </div>
              )}
            </div>
          )}
        </div>
      </sc-choice-container>
    );
  }
}
