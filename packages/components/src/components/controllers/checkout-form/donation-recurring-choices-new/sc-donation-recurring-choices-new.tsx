import { Component, h, Prop, State, Element, Event, EventEmitter } from '@stencil/core';
import { LineItem, LineItemData, Product, Price } from '../../../../types';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

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

  /** The default amount to load the page with. */
  @Prop() defaultAmount: string;

  /** Currency code for the donation. */
  @Prop() currencyCode: string = 'usd';

  /** Order line items. */
  @Prop() lineItems: LineItem[] = [];

  /** Is this loading */
  @Prop() loading: boolean;
  @Prop() busy: boolean;
  @Prop() removeInvalid: boolean = true;

  /** The label for the field. */
  @Prop() label: string;

  /** Holds the line item for this component. */
  @State() lineItem: LineItem;

  /** Error */
  @State() error: string;

  /** Toggle line item event */
  @Event() scUpdateLineItem: EventEmitter<LineItemData>;

  @Event() scChange: EventEmitter<string>;

  handleChange() {
    console.log(this.priceId);
    
    this.scUpdateLineItem.emit({ price_id: this.priceId, quantity: 1 });
  }

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
      <div class="sc-donation-recurring-choices-new">
        <sc-choices>
          <div class="sc-donation-recurring-choices">
            <div class="sc-donation-recurring-choice">
              <sc-recurring-price-choice-container
                label={__('Subscribe and Save', 'surecart')}
                prices={recurringPrices}
                product={this?.selectedProduct}
                selectedPrice={ this.prices?.find(price => price.id === this.priceId) }
                onScChange={e => {
                  if (e?.detail) {
                    this.priceId = e.detail;
                    this.handleChange();
                  }
                }}
                showPriceDetails={false}
              />
            </div>
            <div class="sc-donation-recurring-choice">
              <sc-choice 
                show-control="false" 
                size="small" 
                value={nonRecurringPrice?.id}
                onScChange={e => {
                  if( e?.detail ) {
                    this.priceId = nonRecurringPrice?.id;
                    this.handleChange();
                  }
                }}
                checked={this.priceId === nonRecurringPrice?.id}
              >
                <div class="price-choice__title">
                  <div class="price-choice__name">{__('No, donate once', 'surecart')}</div>
                </div>  
              </sc-choice>
            </div>
          </div>
        </sc-choices>
        {this.busy && <sc-block-ui style={{ zIndex: '9' }}></sc-block-ui>}
      </div>
    );
  }
}

openWormhole(ScDonationRecurringChoicesNew, ['lineItems', 'loading', 'busy', 'currencyCode'], false);
