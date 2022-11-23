import { Component, h, Prop, Event, EventEmitter, Element, Fragment } from '@stencil/core';
import { __, _n, sprintf } from '@wordpress/i18n';

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
        <div class="item__price">
          <div class="price">{sprintf(_n('%d day free', '%d days free', this.trialDurationDays, 'surecart'), this.trialDurationDays)}</div>
          <div class="price__description">
            {__('Then', 'surecart')}{' '}
            {this.scratchAmount && this.scratchAmount !== this.amount && (
              <Fragment>
                <sc-format-number class="item__scratch-price" type="currency" currency={this.currency} value={this.scratchAmount}></sc-format-number>{' '}
              </Fragment>
            )}
            <sc-format-number type="currency" currency={this.currency} value={this.amount}></sc-format-number> {!!this.interval && this.interval}
          </div>
        </div>
      );
    }

    return (
      <div class="item__price">
        <div class="price">
          {this.scratchAmount && this.scratchAmount !== this.amount && (
            <Fragment>
              <sc-format-number class="item__scratch-price" type="currency" currency={this.currency} value={this.scratchAmount}></sc-format-number>{' '}
            </Fragment>
          )}
          <sc-format-number type="currency" currency={this.currency} value={this.amount}></sc-format-number>
        </div>
        {!!this.interval && <div class="price__description">{this.interval}</div>}
      </div>
    );
  }

  render() {
    return (
      <div class={{ 'item': true, 'item--has-image': !!this.imageUrl }}>
        {!!this.imageUrl && <img src={this.imageUrl} class="item__image" />}
        <div class="item__text">
          <div class="item__title">
            <slot name="title">{this.name}</slot>
          </div>
          {this.editable && (
            <sc-quantity-select
              max={this.max || Infinity}
              clickEl={this.el}
              quantity={this.quantity}
              onScChange={e => e.detail && this.scUpdateQuantity.emit(e.detail)}
            ></sc-quantity-select>
          )}
          {!this.editable && this.quantity > 1 && (
            <span class="item__description">
              {__('Qty:', 'surecart')} {this.quantity}
            </span>
          )}
        </div>
        <div class="item__suffix">
          {this.removable ? <sc-icon class="item__remove" name="x" onClick={() => this.scRemove.emit()}></sc-icon> : <div></div>}
          {this.renderPriceAndInterval()}
        </div>
      </div>
    );
  }
}
