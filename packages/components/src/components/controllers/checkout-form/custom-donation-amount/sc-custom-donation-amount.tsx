import { Component, h, Prop, Element, Fragment } from '@stencil/core';
import { state as checkoutState } from '@store/checkout';
import { createOrUpdateCheckout } from '../../../../services/session';
import { Checkout } from '../../../../types';
import { createErrorNotice } from '@store/notices/mutations';

@Component({
  tag: 'sc-custom-donation-amount',
  styleUrl: 'sc-custom-donation-amount.scss',
})

export class ScCustomDonationAmount {

  @Element() el: HTMLScCustomDonationAmountElement;

  /** Currency code for the donation. */
  @Prop() currencyCode: string = 'usd';

  @Prop() value: string;

  async handleButtonClick(e) {
    e.preventDefault();

    const checkoutLineItem = checkoutState.checkout?.line_items?.data?.[0];
    const lineItems = [{ id: checkoutLineItem?.id, price_id: checkoutLineItem?.price?.id, quantity: 1, ad_hoc_amount: parseInt(this.value) }];

    const data = {
      line_items: lineItems,
    };
    
    try {
      checkoutState.checkout = (await createOrUpdateCheckout({
        id: checkoutState.checkout?.id,
        data
      })) as Checkout;
    } catch (e) {
      console.error(e);
      createErrorNotice(e);
      throw e;
    }
  }

  handlePriceChange(e) {
    const value = e?.target?.value;
    this.value = value;
  }

  render() {
    return (
      <Fragment>
      <sc-choice-container value={this.value} show-control="false">
        <sc-price-input
            currencyCode={this.currencyCode}
            showCode={false}
            showLabel={false}
            onScChange={(e) => this.handlePriceChange(e)}
        > 
          <sc-button 
            onClick={(e) => this.handleButtonClick(e)}
            slot="suffix" 
            circle
          >
            <sc-icon name="arrow-right"></sc-icon>
          </sc-button>
        </sc-price-input>
      </sc-choice-container>
      </Fragment>
    );
  }
}
