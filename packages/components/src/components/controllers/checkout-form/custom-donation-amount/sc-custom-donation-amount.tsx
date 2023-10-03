import { Component, h, Prop, Element, Fragment } from '@stencil/core';
import { state as checkoutState, onChange } from '@store/checkout';
import { createOrUpdateCheckout } from '../../../../services/session';
import { Checkout, LineItem } from '../../../../types';
import { createErrorNotice } from '@store/notices/mutations';
import { updateFormState } from '@store/form/mutations';

@Component({
  tag: 'sc-custom-donation-amount',
  styleUrl: 'sc-custom-donation-amount.scss',
})
export class ScCustomDonationAmount {
  private removeCheckoutListener: () => void;

  @Element() el: HTMLScCustomDonationAmountElement;

  /** Currency code for the donation. */
  @Prop() currencyCode: string = 'usd';

  @Prop() value: string;

  /** Order line items. */
  @Prop() lineItem: LineItem;

  componentWillLoad() {
    this.lineItem = checkoutState?.checkout?.line_items?.data?.[0];
    this.removeCheckoutListener = onChange('checkout', () => this.handleSessionChange());
  }

  /** Remove listener. */
  disconnectedCallback() {
    this.removeCheckoutListener();
  }

  handleSessionChange() {
    this.lineItem = checkoutState?.checkout?.line_items?.data?.[0];
  }

  async handleButtonClick(e) {
    e.stopImmediatePropagation();
    const lineItems = [{ id: this.lineItem?.id, price_id: this.lineItem?.price?.id, quantity: 1, ad_hoc_amount: parseInt(this.value) }];

    const data = {
      line_items: lineItems,
    };

    try {
      updateFormState('FETCH');
      checkoutState.checkout = (await createOrUpdateCheckout({
        id: checkoutState.checkout?.id,
        data,
      })) as Checkout;
      updateFormState('RESOLVE');
    } catch (e) {
      updateFormState('REJECT');
      console.error(e);
      createErrorNotice(e, { dismissible: true });
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
          <sc-form onScFormSubmit={e => this.handleButtonClick(e)}>
            <sc-price-input
              currencyCode={this.currencyCode}
              showCode={false}
              showLabel={false}
              onScChange={e => this.handlePriceChange(e)}
              min={this.lineItem?.price?.ad_hoc_min_amount}
              max={this.lineItem?.price?.ad_hoc_max_amount}
            >
              <sc-button circle submit slot="suffix">
                <sc-icon name="arrow-right"></sc-icon>
              </sc-button>
            </sc-price-input>
          </sc-form>
        </sc-choice-container>
      </Fragment>
    );
  }
}
