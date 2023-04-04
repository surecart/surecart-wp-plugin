import { Component, Event, EventEmitter, Fragment, h, Prop } from '@stencil/core';
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
  @Prop({ mutable: true }) price: Price;

  /** Is this loading */
  @Prop({ mutable: true }) loading: boolean = false;

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

  /** Is this checked by default */
  @Prop({ reflect: true, mutable: true }) checked: boolean = false;

  @Event() scChange: EventEmitter<void>;

  renderPrice() {
    return (
      <Fragment>
        <sc-format-number type="currency" value={this.price.amount} currency={this.price.currency}></sc-format-number>
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
      <sc-choice-container value={this.price?.id} type={this.type} showControl={this.showControl} checked={this.checked} onScChange={() => this.scChange.emit()}>
        <div class="price-choice">
          {this.showLabel && (
            <div class="price-choice__title">
              <div class="price-choice__name">{this.label || this.price.name}</div>
              {!!this.description && <div class="price-choice__description">{this.description}</div>}
            </div>
          )}

          {this.showPrice && (
            <div class="price-choice__details">
              <div class="price-choice__price">
                {this.price?.ad_hoc ? (
                  __('Custom Amount', 'surecart')
                ) : (
                  <Fragment>
                    <sc-format-number type="currency" value={this.price.amount} currency={this.price.currency}></sc-format-number>
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

              {!!this.price.trial_duration_days && (
                <div class="price-choice__trial">
                  {sprintf(_n('Starting in %s day', 'Starting in %s days', this.price.trial_duration_days, 'surecart'), this.price.trial_duration_days)}
                </div>
              )}

              {!!this.price.setup_fee_enabled && this.price?.setup_fee_amount && (
                <div class="price-choice__setup-fee">
                  <sc-format-number type="currency" value={this.price.setup_fee_amount} currency={this.price.currency}></sc-format-number>{' '}
                  {this.price.setup_fee_name || __('Setup Fee', 'surecart')}
                </div>
              )}
            </div>
          )}
        </div>
      </sc-choice-container>
    );
  }
}
