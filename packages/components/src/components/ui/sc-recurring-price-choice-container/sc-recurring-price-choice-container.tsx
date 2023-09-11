import { Component, Event, EventEmitter, Fragment, h, Prop, Watch } from '@stencil/core';
import { __, _n, sprintf } from '@wordpress/i18n';
import { Price } from 'src/types';
import { state } from '@store/product';
import { intervalString } from '../../../functions/price';

@Component({
  tag: 'sc-recurring-price-choice-container',
  styleUrl: 'sc-recurring-price-choice-container.scss',
  shadow: false,
})
export class ScRecurringPriceChoiceContainer {
  /** Stores the price */
  @Prop() price: Price;

  /** Label for the choice. */
  @Prop() label: string;

  /** Show the radio/checkbox control */
  @Prop() showControl: boolean = false;

  /** Choice Type */
  @Prop() type: 'checkbox' | 'radio';

  @Prop() prices: Price[];

  @Event() scChange: EventEmitter<void>;

  @Watch('price')
  handlePriceChange() {
    state.selectedPrice = this.price;
  }
  componentWillLoad() {
    this.price = this.prices?.[0]
    this.handlePriceChange();
  }

  renderPrice(price) {
    return (
      <Fragment>
        <sc-format-number type="currency" value={price?.amount} currency={price?.currency}></sc-format-number>
      </Fragment>
    );
  }

  render() {
    console.log(this.prices);
    
    const cardChecked = this.prices.find(price => price.id === this.price?.id);
    return (
      <sc-choice-container value={this.price?.id} type={this.type} showControl={this.showControl} checked={!!cardChecked} onScChange={() => this.scChange.emit()}>
        <div class="price-choice__title">
          <div class="price-choice__name">{this.label}</div>
          <div class="recurring-price-choice__description-details-wrap">
            <div class="recurring-price-choice__description">
              <sc-dropdown style={{ '--panel-width': '25em' }}>
                <sc-button type="text" caret slot="trigger">
                  {this.price?.name || state.product?.name}
                </sc-button>
                <sc-menu>
                  {(this.prices || []).map(price => {
                    const checked = this.price?.id === price?.id;
                    return (
                      <sc-menu-item onClick={() => (this.price = price)} class={`recurring-price-choice__menu-item ${checked ? 'checked' : ''}`}>
                        { checked && (
                          <span part="checked-icon" class="menu-item__check">
                              <sc-icon name="check" slot="prefix"/>
                          </span>
                        )}
                        <span part="label" class="menu-item__label">
                          {price?.name || state.product?.name}
                        </span>
                        <span slot="suffix">{this.renderPrice(price)}</span>
                      </sc-menu-item>
                    );
                  })}
                </sc-menu>
              </sc-dropdown>
            </div>
            <div class="recurring-price-choice__details">
              <div class="price-choice__price">
                {this.price?.ad_hoc ? (
                  __('Custom Amount', 'surecart')
                ) : (
                  <Fragment>
                    <sc-format-number type="currency" value={this.price?.amount} currency={this.price?.currency}></sc-format-number>
                    {intervalString(this.price, {
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

              {!!this.price?.trial_duration_days && (
                <div class="price-choice__trial">
                  {sprintf(_n('Starting in %s day', 'Starting in %s days', this.price.trial_duration_days, 'surecart'), this.price.trial_duration_days)}
                </div>
              )}

              {!!this.price?.setup_fee_enabled && this.price?.setup_fee_amount && (
                <div class="price-choice__setup-fee">
                  <sc-format-number type="currency" value={this.price.setup_fee_amount} currency={this.price?.currency}></sc-format-number>{' '}
                  {this.price?.setup_fee_name || __('Setup Fee', 'surecart')}
                </div>
              )}
            </div>
          </div>
        </div>
      </sc-choice-container>
    );
  }
}
