import { Component, h, Prop, Event, EventEmitter, Element } from '@stencil/core';
import { getFormattedPrice } from '../../../functions/price';

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

  /** Can we select the quantity */
  @Prop() edit: boolean = true;

  /** Product monetary amount */
  @Prop() amount: number;

  /** Currency for the product */
  @Prop() currency: string;

  /** Recurring interval (i.e. monthly, once, etc.) */
  @Prop() interval: string;

  /** Is the line item removable */
  @Prop() isRemovable: boolean;

  /** Emitted when the quantity changes. */
  @Event() ceUpdateQuantity: EventEmitter<number>;

  render() {
    return (
      <ce-line-item>
        {!!this.imageUrl && <img src={this.imageUrl} slot="image" />}
        <span slot="title">{this.name}</span>
        <span slot="description">
          {this.edit ? (
            <ce-quantity-select clickEl={this.el} quantity={this.quantity} onCeChange={e => this.ceUpdateQuantity.emit(e.detail)}></ce-quantity-select>
          ) : (
            <span>Qty: {this.quantity}</span>
          )}
          {this.isRemovable && this.edit && <ce-tag size="small">Remove</ce-tag>}
        </span>
        <span slot="price">{getFormattedPrice({ amount: this.amount, currency: this.currency })}</span>
        {!!this.interval && <span slot="price-description">{this.interval}</span>}
      </ce-line-item>
    );
  }
}
