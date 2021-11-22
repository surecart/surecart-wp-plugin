import { Component, h, Prop, Event, EventEmitter, Element, Fragment } from '@stencil/core';
import { __, _n, sprintf } from '@wordpress/i18n';

import { TrashIcon } from '../../icons';

@Component({
  tag: 'ce-product-line-item',
  styleUrl: 'ce-product-line-item.css',
  shadow: true,
})
export class CeProductLineItem {
  @Element() el: HTMLCeProductLineItemElement;

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
  @Event({ bubbles: false }) ceUpdateQuantity: EventEmitter<number>;

  /** Emitted when the quantity changes. */
  @Event({ bubbles: false }) ceRemove: EventEmitter<void>;

  renderPriceAndInterval() {
    if (this.trialDurationDays) {
      return (
        <Fragment>
          <span slot="price">{sprintf(_n('%d day free', '%d days free', this.trialDurationDays), this.trialDurationDays)}</span>
          <span slot="price-description">
            {__('Then', 'checkout_engine')} <ce-format-number type="currency" currency={this.currency} value={this.amount}></ce-format-number> {!!this.interval && this.interval}
          </span>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <span slot="price">
          <ce-format-number type="currency" currency={this.currency} value={this.amount}></ce-format-number>
        </span>
        {!!this.interval && <span slot="price-description">{this.interval}</span>}
      </Fragment>
    );
  }

  render() {
    return (
      <ce-line-item>
        {!!this.imageUrl && <img src={this.imageUrl} slot="image" />}
        <span slot="title">{this.name}</span>
        <span class="product__description" slot="description">
          {this.editable && <ce-quantity-select clickEl={this.el} quantity={this.quantity} onCeChange={e => this.ceUpdateQuantity.emit(e.detail)}></ce-quantity-select>}
          {!this.editable && <span>Qty: {this.quantity}</span>}

          {this.removable && (
            <div class="price__remove" onClick={() => this.ceRemove.emit()}>
              <TrashIcon size={15} strokeWidth={2.5} />
            </div>
          )}
        </span>
        {this.renderPriceAndInterval()}
      </ce-line-item>

      // <ce-line-item>
      //   {!!this.imageUrl && <img src={this.imageUrl} slot="image" />}
      //   <span slot="title">{this.name}</span>
      //   <span class="product__description" slot="description">
      //     {this.edit ? (
      //       <ce-quantity-select clickEl={this.el} quantity={this.quantity} onCeChange={e => this.ceUpdateQuantity.emit(e.detail)}></ce-quantity-select>
      //     ) : (
      //       <span>Qty: {this.quantity}</span>
      //     )}
      //     | <ce-format-number type="currency" currency={this.currency} value={this.amount}></ce-format-number>
      //   </span>
      //   <span slot="price">
      //     {this.isRemovable && this.edit && (
      //       <span onClick={() => this.ceRemove.emit()}>
      //         <TrashIcon class="price__remove" size={18} />
      //       </span>
      //     )}
      //   </span>
      // </ce-line-item>
    );
  }
}
