import { Component, Host, h, Prop, Fragment, State, Event, EventEmitter, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { intervalString } from '../../../../functions/price';
import { LineItemData } from 'src/types';
import { getLineItemByProductId } from '@store/checkout/getters';
import { formBusy } from '@store/form/getters';
import { onChange } from '@store/checkout';

@Component({
  tag: 'sc-product-selected-price',
  styleUrl: 'sc-product-selected-price.scss',
  shadow: true,
})
export class ScProductSelectedPrice {
  /** The input reference */
  private input: HTMLScPriceInputElement;

  /** The product id. */
  @Prop() productId: string;

  /** Show the input? */
  @State() showInput: boolean;

  /** The adHocAmount */
  @State() adHocAmount: number;

  /** Toggle line item event */
  @Event() scUpdateLineItem: EventEmitter<LineItemData>;

  /** The line item from state. */
  lineItem() {
    return getLineItemByProductId(this.productId);
  }

  componentWillLoad() {
    onChange('checkout', () => {
      this.adHocAmount = this.lineItem()?.ad_hoc_amount || this.lineItem()?.price?.amount;
    });
  }

  updatePrice() {
    this.showInput = false;
    if (!this.adHocAmount && this.adHocAmount !== 0) return;
    if (this.adHocAmount === this.lineItem()?.ad_hoc_amount) return;
    this.scUpdateLineItem.emit({ price_id: this.lineItem()?.price?.id, quantity: 1, ad_hoc_amount: this.adHocAmount });
  }

  @Watch('showInput')
  handleShowInputChange(val) {
    if (val) {
      setTimeout(() => {
        this.input.triggerFocus();
      }, 50);
    }
  }

  render() {
    const price = this.lineItem()?.price;
    if (!price) return <Host style={{ display: 'none' }}></Host>;

    return (
      <div class={{ 'selected-price': true }}>
        {this.showInput ? (
          <sc-form
            onScSubmit={e => {
              e.preventDefault();
              e.stopImmediatePropagation();
              this.updatePrice();
            }}
            onScFormSubmit={e => {
              e.preventDefault();
              e.stopImmediatePropagation();
            }}
          >
            <sc-price-input
              ref={el => (this.input = el as HTMLScPriceInputElement)}
              size="large"
              currency-code={price?.currency || 'usd'}
              min={price?.ad_hoc_min_amount}
              max={price?.ad_hoc_max_amount}
              placeholder={'0.00'}
              required={true}
              value={this.adHocAmount?.toString?.()}
              onScInput={e => (this.adHocAmount = parseInt(e.target.value))}
            >
              <sc-button slot="suffix" type="link" submit>
                {__('Update', 'surecart')}
              </sc-button>
            </sc-price-input>
          </sc-form>
        ) : (
          <Fragment>
            <div class="selected-price__wrap">
              <span class="selected-price__price">
                {price?.scratch_amount > price.amount && (
                  <Fragment>
                    <sc-format-number
                      class="selected-price__scratch-price"
                      part="price__scratch"
                      type="currency"
                      currency={price?.currency}
                      value={price?.scratch_amount}
                    ></sc-format-number>{' '}
                  </Fragment>
                )}
                <sc-format-number type="currency" currency={price?.currency} value={this.lineItem()?.ad_hoc_amount !== null ? this.lineItem()?.ad_hoc_amount : price?.amount} />
              </span>
              <span class="selected-price__interval">
                {intervalString(price, {
                  labels: {
                    interval: '/',
                    period:
                      /** translators: used as in time period: "for 3 months" */
                      __('for', 'surecart'),
                  },
                })}
              </span>
            </div>

            {price?.ad_hoc && !formBusy() && (
              <sc-button class="selected-price__change-amount" type="primary" size="small" onClick={() => (this.showInput = true)}>
                <sc-icon name="edit" slot="prefix"></sc-icon>
                {__('Change Amount', 'surecart')}
              </sc-button>
            )}
          </Fragment>
        )}
      </div>
    );
  }
}
