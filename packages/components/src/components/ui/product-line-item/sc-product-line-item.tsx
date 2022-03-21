import { Component, h, Prop, Event, EventEmitter, Element, Fragment } from '@stencil/core';
import { __, _n, sprintf } from '@wordpress/i18n';

import { TrashIcon } from '../../icons';

@Component({
  tag: 'sc-product-line-item',
  styleUrl: 'sc-product-line-item.css',
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

  /** Emitted when the quantity changes. */
  @Event({ bubbles: false }) scUpdateQuantity: EventEmitter<number>;

  /** Emitted when the quantity changes. */
  @Event({ bubbles: false }) scRemove: EventEmitter<void>;

  renderPriceAndInterval() {
    if (this.trialDurationDays) {
      return (
        <Fragment>
          <span slot="price">{sprintf(_n('%d day free', '%d days free', this.trialDurationDays), this.trialDurationDays)}</span>
          <span slot="price-description">
            {__('Then', 'surecart')} <sc-format-number type="currency" currency={this.currency} value={this.amount}></sc-format-number> {!!this.interval && this.interval}
          </span>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <span slot="price">
          <sc-format-number type="currency" currency={this.currency} value={this.amount}></sc-format-number>
        </span>
        {!!this.interval && <span slot="price-description">{this.interval}</span>}
      </Fragment>
    );
  }

  render() {
    return (
      <sc-line-item>
        {!!this.imageUrl && <img src={this.imageUrl} slot="image" />}
        <span slot="title">{this.name}</span>
        <span class="product__description" slot="description">
          {this.editable && <sc-quantity-select clickEl={this.el} quantity={this.quantity} onScChange={e => this.scUpdateQuantity.emit(e.detail)}></sc-quantity-select>}
          {!this.editable && <span>Qty: {this.quantity}</span>}

          {this.removable && (
            <div class="price__remove" onClick={() => this.scRemove.emit()}>
              <TrashIcon size={15} strokeWidth={2.5} />
            </div>
          )}
        </span>
        {this.renderPriceAndInterval()}
      </sc-line-item>
    );
  }
}
