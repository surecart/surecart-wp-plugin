import { Component, h, Prop, Event, EventEmitter, Element, Fragment } from '@stencil/core';
import { __, _n, sprintf } from '@wordpress/i18n';
import { isRtl } from '../../../functions/page-align';

/**
 * @part base - The elements base wrapper.
 * @part text - The text wrapper.
 * @part title - The product title.
 * @part static-quantity - The statically displayed quantity.
 * @part quantity__base - The quantity base wrapper.
 * @part input - The input control.
 * @part minus - The minus control.
 * @part minus-icon - The minus icon.
 * @part plus - The plus control.
 * @part plus-icon - The plus icon.
 * @part remove-icon__base - The remove icon base wrapper.
 * @part price - The price wrapper.
 * @part price__amount - The price amount.
 * @part price__description - The price description.
 * @part suffix - The suffix items.
 */
@Component({
  tag: 'sc-product-line-item',
  styleUrl: 'sc-product-line-item.scss',
  shadow: true,
})
export class ScProductLineItem {
  @Element() el: HTMLScProductLineItemElement;

  /** Url for the product image */
  @Prop() imageUrl: string;

  /** Product name */
  @Prop() name: string;

  /** Quantity */
  @Prop() quantity: number;

  /** Product monetary amount */
  @Prop() amount: number;

  /** The line item scratch amount */
  @Prop() scratchAmount: number;

  /** Currency for the product */
  @Prop() currency: string;

  /** Recurring interval (i.e. monthly, once, etc.) */
  @Prop() interval: string;

  /** Trial duration days */
  @Prop() trialDurationDays: number;

  /** Is the line item removable */
  @Prop() removable: boolean;

  /** Can we select the quantity */
  @Prop() editable: boolean = true;

  /** The max allowed. */
  @Prop() max: number = 100;

  /** Emitted when the quantity changes. */
  @Event({ bubbles: false }) scUpdateQuantity: EventEmitter<number>;

  /** Emitted when the quantity changes. */
  @Event({ bubbles: false }) scRemove: EventEmitter<void>;

  renderPriceAndInterval() {
    if (this.trialDurationDays) {
      return (
        <div class="item__price" part="price">
          <div class="price" part="price__amount">
            {sprintf(_n('%d day free', '%d days free', this.trialDurationDays, 'surecart'), this.trialDurationDays)}
          </div>
          <div class="price__description" part="price__description">
            {__('Then', 'surecart')}{' '}
            {!!this.scratchAmount && this.scratchAmount > this.amount && (
              <Fragment>
                <sc-format-number class="item__scratch-price" part="price__scratch" type="currency" currency={this.currency} value={this.scratchAmount}></sc-format-number>{' '}
              </Fragment>
            )}
            <sc-format-number part="price__amount" type="currency" currency={this.currency} value={this.amount}></sc-format-number> {!!this.interval && this.interval}
          </div>
        </div>
      );
    }

    return (
      <div class="item__price" part="price">
        <div class="price" part="price__amount">
          {!!this.scratchAmount && this.scratchAmount !== this.amount && (
            <Fragment>
              <sc-format-number class="item__scratch-price" type="currency" currency={this.currency} value={this.scratchAmount}></sc-format-number>{' '}
            </Fragment>
          )}
          <sc-format-number type="currency" currency={this.currency} value={this.amount}></sc-format-number>
        </div>
        {!!this.interval && (
          <div class="price__description" part="price__description">
            {this.interval}
          </div>
        )}
      </div>
    );
  }

  render() {
    return (
      <div part="base" class={{ 'item': true, 'item--has-image': !!this.imageUrl, 'item--is-rtl': isRtl() }}>
        {!!this.imageUrl && <img part="image" src={this.imageUrl} class="item__image" />}
        <div class="item__text" part="text">
          <div class="item__title" part="title">
            <slot name="title">{this.name}</slot>
          </div>
          {this.editable && (
            <sc-quantity-select
              max={this.max || Infinity}
              exportparts="base:quantity__base, minus, minus-icon, plus, plus-icon, input"
              clickEl={this.el}
              quantity={this.quantity}
              onScChange={e => e.detail && this.scUpdateQuantity.emit(e.detail)}
            ></sc-quantity-select>
          )}
          {!this.editable && this.quantity > 1 && (
            <span class="item__description" part="static-quantity">
              {__('Qty:', 'surecart')} {this.quantity}
            </span>
          )}
        </div>
        <div class="item__suffix" part="suffix">
          {this.removable ? <sc-icon exportparts="base:remove-icon__base" class="item__remove" name="x" onClick={() => this.scRemove.emit()}></sc-icon> : <div></div>}
          {this.renderPriceAndInterval()}
        </div>
      </div>
    );
  }
}
