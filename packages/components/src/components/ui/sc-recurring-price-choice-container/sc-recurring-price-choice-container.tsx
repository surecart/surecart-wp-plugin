import { Component, Event, EventEmitter, Fragment, h, Prop, Host } from '@stencil/core';
import { __, _n, sprintf } from '@wordpress/i18n';
import { Price, Product } from 'src/types';
import { intervalString } from '../../../functions/price';

@Component({
  tag: 'sc-recurring-price-choice-container',
  styleUrl: 'sc-recurring-price-choice-container.scss',
  shadow: false,
})
export class ScRecurringPriceChoiceContainer {
  /** The prices to choose from. */
  @Prop() prices: Price[];

  /** The currently selected price */
  @Prop() selectedPrice: Price;

  /** The product. */
  @Prop() product: Product;

  /** Label for the choice. */
  @Prop() label: string;

  /** Show the radio/checkbox control */
  @Prop() showControl: boolean = false;

  /** Should we show the price? */
  @Prop() showAmount: boolean = true;

  /** Should we show the price details? */
  @Prop() showDetails: boolean = true;

  /** Change event. */
  @Event() scChange: EventEmitter<string>;

  renderPrice(price) {
    return <sc-format-number type="currency" value={price?.amount} currency={price?.currency}></sc-format-number>;
  }

  value() {
    return this.prices.find(price => price.id === this.selectedPrice?.id) || this.prices[0];
  }

  render() {
    if (!this.prices?.length) {
      return <Host style={{ display: 'none' }}></Host>;
    }

    return (
      <sc-choice-container
        value={this.selectedPrice?.id}
        type={'radio'}
        showControl={this.showControl}
        checked={this.prices.some(price => price.id === this.selectedPrice?.id)}
        onScChange={e => {
          e.stopPropagation();
          this.scChange.emit(this.value()?.id);
        }}
      >
        <div class="recurring-price-choice">
          <div class="recurring-price-choice__control">
            <div class="recurring-price-choice__name">
              <slot>{this.label}</slot>
            </div>

            {this.prices?.length > 1 && (
              <div class="recurring-price-choice__description">
                <sc-dropdown style={{ '--panel-width': 'max(100%, 11rem)', '--sc-menu-item-white-space': 'wrap' }}>
                  <button class="recurring-price-choice__button" slot="trigger">
                    {this.value()?.name ||
                      (this.value()?.recurring_interval
                        ? intervalString(this.value(), {
                            showOnce: true,
                            abbreviate: false,
                            labels: {
                              interval: __('Every', 'surecart'),
                              period:
                                /** translators: used as in time period: "for 3 months" */
                                __('for', 'surecart'),
                            },
                          })
                        : this.product.name)}
                    <sc-icon name="chevron-down"></sc-icon>
                  </button>
                  <sc-menu>
                    {(this.prices || []).map(price => {
                      const checked = price?.id === this.selectedPrice?.id;
                      return (
                        <sc-menu-item onClick={() => this.scChange.emit(price?.id)} checked={checked}>
                          {price?.name ||
                            (price?.recurring_interval
                              ? intervalString(price, {
                                  showOnce: true,
                                  abbreviate: false,
                                  labels: {
                                    interval: __('Every', 'surecart'),
                                    period:
                                      /** translators: used as in time period: "for 3 months" */
                                      __('for', 'surecart'),
                                  },
                                })
                              : this.product.name)}
                          {this.showAmount && <span slot="suffix">{this.renderPrice(price)}</span>}
                        </sc-menu-item>
                      );
                    })}
                  </sc-menu>
                </sc-dropdown>
              </div>
            )}
          </div>

          {this.showDetails && (
            <div class="recurring-price-choice__details">
              <div class="recurring-price-choice__price">
                {this.selectedPrice?.ad_hoc ? (
                  __('Custom Amount', 'surecart')
                ) : (
                  <Fragment>
                    <sc-format-number type="currency" value={this.selectedPrice?.amount} currency={this.selectedPrice?.currency}></sc-format-number>
                    {intervalString(this.selectedPrice, {
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
                )}
              </div>

              {!!this.selectedPrice?.trial_duration_days && (
                <div class="recurring-price-choice__trial">
                  {sprintf(_n('Starting in %s day', 'Starting in %s days', this.selectedPrice.trial_duration_days, 'surecart'), this.selectedPrice.trial_duration_days)}
                </div>
              )}

              {!!this.selectedPrice?.setup_fee_enabled && this.selectedPrice?.setup_fee_amount && (
                <div class="recurring-price-choice__setup-fee">
                  <sc-format-number type="currency" value={this.selectedPrice.setup_fee_amount} currency={this.selectedPrice?.currency}></sc-format-number>{' '}
                  {this.selectedPrice?.setup_fee_name || __('Setup Fee', 'surecart')}
                </div>
              )}
            </div>
          )}
        </div>
      </sc-choice-container>
    );
  }
}
