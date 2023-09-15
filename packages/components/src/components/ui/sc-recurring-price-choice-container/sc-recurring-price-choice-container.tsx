import { Component, Event, EventEmitter, Fragment, h, Prop } from '@stencil/core';
import { __, _n, sprintf } from '@wordpress/i18n';
import { Price, Product } from 'src/types';
import { intervalString } from '../../../functions/price';

@Component({
  tag: 'sc-recurring-price-choice-container',
  styleUrl: 'sc-recurring-price-choice-container.scss',
  shadow: false,
})
export class ScRecurringPriceChoiceContainer {

  @Prop() selectedPrice: Price;

  @Prop() product: Product;

  /** Label for the choice. */
  @Prop() label: string;

  /** Show the radio/checkbox control */
  @Prop() showControl: boolean = false;

  @Prop() showPriceDetails: boolean = true;
  
  /** Choice Type */
  @Prop() type: 'checkbox' | 'radio';

  @Prop() prices: Price[];

  @Event() scChange: EventEmitter<string>;

  renderPrice(price) {
    return (
      <Fragment>
        <sc-format-number type="currency" value={price?.amount} currency={price?.currency}></sc-format-number>
      </Fragment>
    );
  }

  render() {
    const cardChecked = this.prices?.find(price => price.id === this.selectedPrice?.id);
    const selectedPriceName = cardChecked ? this.selectedPrice?.name : this.prices?.[0]?.name ? this.prices?.[0]?.name : this.product?.name;

    return (
      <sc-choice-container value={this.selectedPrice?.id} type={this.type} showControl={this.showControl} checked={!!cardChecked} onScChange={() => this.scChange.emit()}>
        <div class="price-choice__title">
          <div class="price-choice__name">{this.label}</div>
          <div class="recurring-price-choice__description-details-wrap">
            <div class="recurring-price-choice__description">
              <sc-dropdown style={{ '--panel-width': '25em' }}>
                <sc-button type="text" caret slot="trigger">
                  {selectedPriceName}
                </sc-button>
                <sc-menu>
                  {(this.prices || []).map(price => {
                    const checked = this.selectedPrice?.id === price?.id;
                    return (
                      <sc-menu-item onClick={() => (this.scChange.emit(price?.id))} class={`recurring-price-choice__menu-item ${checked ? 'checked' : ''}`}>
                        { checked && (
                          <span part="checked-icon" class="menu-item__check">
                              <sc-icon name="check" slot="prefix"/>
                          </span>
                        )}
                        <span part="label" class="menu-item__label">
                          {price?.name || this.product?.name}
                        </span>
                        <span slot="suffix">{this.renderPrice(price)}</span>
                      </sc-menu-item>
                    );
                  })}
                </sc-menu>
              </sc-dropdown>
            </div>
            { this.showPriceDetails && (
            <div class="recurring-price-choice__details">
              <div class="price-choice__price">
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
                <div class="price-choice__trial">
                  {sprintf(_n('Starting in %s day', 'Starting in %s days', this.selectedPrice.trial_duration_days, 'surecart'), this.selectedPrice.trial_duration_days)}
                </div>
              )}

              {!!this.selectedPrice?.setup_fee_enabled && this.selectedPrice?.setup_fee_amount && (
                <div class="price-choice__setup-fee">
                  <sc-format-number type="currency" value={this.selectedPrice.setup_fee_amount} currency={this.selectedPrice?.currency}></sc-format-number>{' '}
                  {this.selectedPrice?.setup_fee_name || __('Setup Fee', 'surecart')}
                </div>
              )}
            </div>
            )}
          </div>
        </div>
      </sc-choice-container>
    );
  }
}