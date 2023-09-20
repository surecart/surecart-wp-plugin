import { Component, h, Prop, State, Element, Event, EventEmitter } from '@stencil/core';
import { LineItemData, Product, Price } from '../../../../types';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-donation-recurring-choices-new',
  styleUrl: 'sc-donation-recurring-choices-new.scss',
  shadow: true,
})
export class ScDonationRecurringChoicesNew {
  @Element() el: HTMLScDonationRecurringChoicesNewElement;

  /** The product id for the fields. */
  @Prop({ reflect: true }) product: string;

  /** The price id for the fields. */
  @Prop({ reflect: true }) priceId: string;

  @Prop() prices: Price[];

  @Prop() selectedProduct: Product;

  /** Is this loading */
  @Prop() loading: boolean;
  @Prop() busy: boolean;

  /** The label for the field. */
  @Prop() label: string;

  /** Error */
  @State() error: string;

  /** Toggle line item event */
  @Event() scUpdateLineItem: EventEmitter<LineItemData>;

  @Event() scChange: EventEmitter<string|boolean>;

  getChoices() {
    return (this.el.querySelectorAll('.sc-donation-recurring-choice')) || [];
  }

  render() {
    const nonRecurringPrice = this.prices?.find(price => !price?.recurring_interval && price?.ad_hoc);
    const recurringPrices = this.prices?.filter(price => price?.recurring_interval && price?.ad_hoc);

    if (this.loading) {
      return (
        <div class="sc-donation-recurring-choices-new">
          <sc-skeleton style={{ width: '20%', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton style={{ width: '60%', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton style={{ width: '40%', display: 'inline-block' }}></sc-skeleton>
        </div>
      );
    }

    return (
      <div class="sc-donation-recurring-choices-new" part='base'>
        <sc-choices
          label={this.label}
          part='choices'
        >
              <sc-recurring-price-choice-container
                label={__('Yes, count me in!', 'surecart')}
                prices={recurringPrices}
                product={this?.selectedProduct}
                selectedPrice={ this.prices?.find(price => price.id === this.priceId) }
                showPriceDetails={false}
                showPrice={false}
              />
              <sc-choice 
                show-control="false" 
                size="small" 
                value={nonRecurringPrice?.id}
                checked={this.priceId === nonRecurringPrice?.id}
                part='choice'
              >
                <div class="price-choice__title">
                  <div class="price-choice__name">{__('No, donate once', 'surecart')}</div>
                </div>  
              </sc-choice>
        </sc-choices>
        {this.busy && <sc-block-ui style={{ zIndex: '9' }}></sc-block-ui>}
      </div>
    );
  }
}
