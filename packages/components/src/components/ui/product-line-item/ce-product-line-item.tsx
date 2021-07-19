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

  /** Product monetary amount */
  @Prop() amount: number;

  /** Currency for the product */
  @Prop() currency: string;

  /** Recurring interval (i.e. monthly, once, etc.) */
  @Prop() interval: string;

  /** Emitted when the quantity changes. */
  @Event() ceUpdateQuantity: EventEmitter<number>;

  render() {
    return (
      <ce-line-item>
        {!!this.imageUrl && <img src={this.imageUrl} slot="image" />}
        <span slot="title">{this.name}</span>
        <ce-quantity-select clickEl={this.el} quantity={this.quantity} slot="description" onCeChange={e => this.ceUpdateQuantity.emit(e.detail)}></ce-quantity-select>
        <span slot="price">{getFormattedPrice({ amount: this.amount, currency: this.currency })}</span>
        {!!this.interval && <span slot="price-description">{this.interval}</span>}
      </ce-line-item>
    );
  }
}
