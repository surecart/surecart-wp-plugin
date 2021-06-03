import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'ce-line-item',
  styleUrl: 'ce-line-item.scss',
  shadow: true,
})
export class CELineItem {
  /** Price of the item */
  @Prop() price: string;

  /** Currency symbol */
  @Prop() currency: string;

  render() {
    return (
      <div
        part="base"
        class={{
          item: true,
        }}
      >
        <div class="item__title" part="title">
          <slot></slot>
        </div>
        <div class="item__price" part="price">
          <slot name="price">
            <div class="item__price-layout">
              <span class="item_currency">{this.currency}</span>
              {this.price}
            </div>
          </slot>
        </div>
      </div>
    );
  }
}
