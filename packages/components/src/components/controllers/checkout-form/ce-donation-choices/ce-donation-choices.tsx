import { Component, h, Prop, Watch, State, Element, Listen, Event, EventEmitter, Method } from '@stencil/core';
import { LineItem, LineItemData } from '../../../../types';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-donation-choices',
  styleUrl: 'ce-donation-choices.scss',
  shadow: true,
})
export class CeDonationChoices {
  @Element() el: HTMLCeDonationChoicesElement;
  private input: HTMLCePriceInputElement;

  /** The price id for the fields. */
  @Prop({ reflect: true }) priceId: string;

  /** The default amount to load the page with. */
  @Prop() defaultAmount: string;

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
  @Event() ceRemoveLineItem: EventEmitter<LineItemData>;

  /** Toggle line item event */
  @Event() ceUpdateLineItem: EventEmitter<LineItemData>;

  /** Toggle line item event */
  @Event() ceAddLineItem: EventEmitter<LineItemData>;

  @Method()
  async reportValidity() {
    if (!this.input) return true;
    return this.input.shadowRoot.querySelector('ce-input').reportValidity();
  }

  @Listen('ceChange')
  handleChange() {
    const checked = Array.from(this.getChoices()).find(item => item.checked);
    this.showCustomAmount = checked.value === 'ad_hoc';
    if (!isNaN(parseInt(checked.value))) {
      this.ceUpdateLineItem.emit({ price_id: this.priceId, quantity: 1, ad_hoc_amount: parseInt(checked.value) });
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
    choices.forEach((el: HTMLCeChoiceElement) => {
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
      (this.el.querySelector('ce-choice[value="ad_hoc"]') as HTMLCeChoiceElement).checked = true;
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
    return this.el.querySelectorAll('ce-choice');
  }

  removeInvalidPrices() {
    if (!this.lineItem) return;
    // bail if no min or max.
    if (!this.lineItem.price?.ad_hoc_min_amount && !this.lineItem?.price?.ad_hoc_min_amount) {
      return;
    }

    const choices = this.el.querySelectorAll('ce-choice') as NodeListOf<HTMLCeChoiceElement>;

    choices.forEach((el: HTMLCeChoiceElement) => {
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
      ? this.ceUpdateLineItem.emit({ price_id: this.priceId, quantity: 1, ad_hoc_amount: parseInt(this.input.value) })
      : this.ceRemoveLineItem.emit({ price_id: this.priceId, quantity: 1 });
  }

  render() {
    if (this.loading) {
      return (
        <div class="ce-donation-choices">
          <ce-skeleton style={{ width: '20%', display: 'inline-block' }}></ce-skeleton>
          <ce-skeleton style={{ width: '60%', display: 'inline-block' }}></ce-skeleton>
          <ce-skeleton style={{ width: '40%', display: 'inline-block' }}></ce-skeleton>
        </div>
      );
    }

    return (
      <div class="ce-donation-choices">
        <ce-choices label={this.label} auto-width>
          <slot />
        </ce-choices>

        {this.showCustomAmount && (
          <div class="ce-donation-choices__form">
            <ce-price-input
              ref={el => (this.input = el as HTMLCePriceInputElement)}
              required
              label={'Enter an amount'}
              value={this.lineItem?.ad_hoc_amount.toString()}
            ></ce-price-input>
            <ce-button type="primary" onClick={() => this.updateCustomAmount()} full busy={this.busy}>
              {__('Update', 'checkout-engine')}
            </ce-button>
          </div>
        )}

        {this.busy && <ce-block-ui style={{ zIndex: '9' }}></ce-block-ui>}
      </div>
    );
  }
}

openWormhole(CeDonationChoices, ['lineItems', 'loading', 'busy'], false);
