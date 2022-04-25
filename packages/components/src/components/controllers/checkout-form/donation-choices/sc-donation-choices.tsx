import { Component, h, Prop, Watch, State, Element, Listen, Event, EventEmitter, Method } from '@stencil/core';
import { LineItem, LineItemData } from '../../../../types';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'sc-donation-choices',
  styleUrl: 'sc-donation-choices.scss',
  shadow: true,
})
export class ScDonationChoices {
  @Element() el: HTMLScDonationChoicesElement;
  private input: HTMLScPriceInputElement;

  /** The price id for the fields. */
  @Prop({ reflect: true }) priceId: string;

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

  @State() showCustomAmount: boolean;

  /** Toggle line item event */
  @Event() scRemoveLineItem: EventEmitter<LineItemData>;

  /** Toggle line item event */
  @Event() scUpdateLineItem: EventEmitter<LineItemData>;

  /** Toggle line item event */
  @Event() scAddLineItem: EventEmitter<LineItemData>;

  @Method()
  async reportValidity() {
    if (!this.input) return true;
    return this.input.shadowRoot.querySelector('sc-input').reportValidity();
  }

  @Listen('scChange')
  handleChange() {
    const checked = Array.from(this.getChoices()).find(item => item.checked);
    this.showCustomAmount = checked.value === 'ad_hoc';
    if (!isNaN(parseInt(checked.value))) {
      this.scUpdateLineItem.emit({ price_id: this.priceId, quantity: 1, ad_hoc_amount: parseInt(checked.value) });
    }
  }

  @Watch('showCustomAmount')
  handleCustomAmountToggle(val) {
    if (val) {
      setTimeout(() => {
        this.input.triggerFocus();
      }, 50);
    }
  }

  /** Store current line item in state. */
  @Watch('lineItems')
  handleLineItemsChange() {
    if (!this.lineItems?.length) return;
    this.lineItem = (this.lineItems || []).find(lineItem => lineItem.price.id === this.priceId);
  }

  @Watch('lineItem')
  handleLineItemChange(val) {
    this.removeInvalid && this.removeInvalidPrices();
    const choices = this.getChoices();
    let hasCheckedOption = false;
    // check the correct option.
    choices.forEach((el: HTMLScChoiceElement) => {
      if (isNaN(parseInt(el.value)) || el.disabled) return;
      if (parseInt(el.value) === val?.ad_hoc_amount) {
        el.checked = true;
        hasCheckedOption = true;
      } else {
        el.checked = false;
      }
    });

    this.showCustomAmount = !hasCheckedOption;
    // no options are checked, let's fill in the input.
    if (!hasCheckedOption) {
      (this.el.querySelector('sc-choice[value="ad_hoc"]') as HTMLScChoiceElement).checked = true;
    }
  }

  componentDidLoad() {
    this.handleLineItemsChange();
  }

  selectDefaultChoice() {
    const choices = this.getChoices();
    if (!choices.length) return;
    choices[0].checked = true;
  }

  getChoices() {
    return this.el.querySelectorAll('sc-choice');
  }

  removeInvalidPrices() {
    if (!this.lineItem) return;
    // bail if no min or max.
    if (!this.lineItem.price?.ad_hoc_min_amount && !this.lineItem?.price?.ad_hoc_min_amount) {
      return;
    }

    const choices = this.el.querySelectorAll('sc-choice') as NodeListOf<HTMLScChoiceElement>;

    choices.forEach((el: HTMLScChoiceElement) => {
      if (parseInt(el.value) > this.lineItem?.price?.ad_hoc_max_amount || parseInt(el.value) < this.lineItem?.price?.ad_hoc_min_amount) {
        el.style.display = 'none';
        el.disabled = true;
      } else {
        el.style.display = 'flex';
        el.disabled = false;
      }
    });
  }

  updateCustomAmount() {
    if (this.input.value === this.lineItem?.ad_hoc_amount.toString()) return;
    this.input.value
      ? this.scUpdateLineItem.emit({ price_id: this.priceId, quantity: 1, ad_hoc_amount: parseInt(this.input.value) })
      : this.scRemoveLineItem.emit({ price_id: this.priceId, quantity: 1 });
  }

  render() {
    if (this.loading) {
      return (
        <div class="sc-donation-choices">
          <sc-skeleton style={{ width: '20%', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton style={{ width: '60%', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton style={{ width: '40%', display: 'inline-block' }}></sc-skeleton>
        </div>
      );
    }

    return (
      <div class="sc-donation-choices">
        <sc-choices label={this.label} auto-width>
          <slot />
        </sc-choices>

        {this.showCustomAmount && (
          <div class="sc-donation-choices__form">
            <sc-price-input
              ref={el => (this.input = el as HTMLScPriceInputElement)}
              required
              currencyCode={this.currencyCode}
              label={'Enter an amount'}
              value={this.lineItem?.ad_hoc_amount.toString()}
            ></sc-price-input>
            <sc-button type="primary" onClick={() => this.updateCustomAmount()} full busy={this.busy}>
              {__('Update', 'surecart')}
            </sc-button>
          </div>
        )}

        {this.busy && <sc-block-ui style={{ zIndex: '9' }}></sc-block-ui>}
      </div>
    );
  }
}

openWormhole(ScDonationChoices, ['lineItems', 'loading', 'busy', 'currencyCode'], false);
