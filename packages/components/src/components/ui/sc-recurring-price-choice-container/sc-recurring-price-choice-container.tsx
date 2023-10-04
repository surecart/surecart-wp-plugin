import { Component, Event, EventEmitter, Fragment, h, Prop, Host, State, Watch } from '@stencil/core';
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

  /** The current value. */
  @State() value: Price;

  /** Change event. */
  @Event({ bubbles: false }) scChange: EventEmitter<string>;

  renderPrice(price) {
    return (
      <Fragment>
        <sc-format-number type="currency" value={price?.amount} currency={price?.currency}></sc-format-number>
      </Fragment>
    );
  }

  @Watch('selectedPrice')
  handleSelectedPriceChange() {
    // if the selected price is a recurring price, update this value. Otherwise, use the first price.
    this.value = this.prices.find(price => price.id === this.selectedPrice?.id) || this.value || this.prices[0];
  }

  componentWillLoad() {
    this.handleSelectedPriceChange();
  }

  render() {
    if (!this.prices?.length) {
      return <Host></Host>;
    }

    return (
      <sc-choice-container
        value={this.selectedPrice?.id}
        type={'radio'}
        showControl={this.showControl}
        checked={this.prices.some(price => price.id === this.selectedPrice?.id)}
        onScChange={e => {
          e.stopPropagation();
          this.scChange.emit(this.value?.id);
        }}
      >
        <div class="recurring-price-choice">
          <div class="recurring-price-choice__control">
            <div class="recurring-price-choice__name">{this.label}</div>

            <div class="recurring-price-choice__description">
              <sc-dropdown style={{ '--panel-width': '100%' }}>
                <button class="recurring-price-choice__button" slot="trigger">
                  {this.value?.name || (this.value?.product as Product)?.name}
                  <sc-icon name="chevron-down"></sc-icon>
                </button>
                <sc-menu>
                  {(this.prices || []).map(price => {
                    const checked = price?.id === this.selectedPrice?.id;
                    return (
                      <sc-menu-item onClick={() => this.scChange.emit(price?.id)} checked={checked}>
                        {price?.name || this.product?.name}
                        {this.showAmount && <span slot="suffix">{this.renderPrice(price)}</span>}
                      </sc-menu-item>
                    );
                  })}
                </sc-menu>
              </sc-dropdown>
            </div>
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
