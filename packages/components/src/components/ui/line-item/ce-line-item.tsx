import { Component, Prop, h, Element, State } from '@stencil/core';

@Component({
  tag: 'ce-line-item',
  styleUrl: 'ce-line-item.scss',
  shadow: true,
})
export class CELineItem {
  @Element() hostElement: HTMLCeLineItemElement;

  /** Price of the item */
  @Prop() price: string;

  /** Currency symbol */
  @Prop() currency: string;

  @State() hasImageSlot: boolean;
  @State() hasTitleSlot: boolean;
  @State() hasDescriptionSlot: boolean;
  @State() hasPriceSlot: boolean;
  @State() hasPriceDescriptionSlot: boolean;
  @State() hasCurrencySlot: boolean;

  componentWillLoad() {
    this.hasImageSlot = !!this.hostElement.querySelector('[slot="image"]');
    this.hasTitleSlot = !!this.hostElement.querySelector('[slot="title"]');
    this.hasDescriptionSlot = !!this.hostElement.querySelector('[slot="description"]');
    this.hasPriceSlot = !!this.hostElement.querySelector('[slot="price"]');
    this.hasPriceDescriptionSlot = !!this.hostElement.querySelector('[slot="price-description"]');
    this.hasCurrencySlot = !!this.hostElement.querySelector('[slot="currency"]');
  }

  render() {
    return (
      <div
        part="base"
        class={{
          'item': true,
          'item--has-image': this.hasImageSlot,
          'item--has-title': this.hasTitleSlot,
          'item--has-description': this.hasDescriptionSlot,
          'item--has-price': this.hasPriceSlot,
          'item--has-price-description': this.hasPriceDescriptionSlot,
          'item--has-price-currency': this.hasCurrencySlot,
        }}
      >
        <div class="item__image" part="image">
          <slot name="image"></slot>
        </div>

        <div class="item__text" part="text">
          <div class="item__title">
            <slot name="title"></slot>
          </div>
          <div class="item__description">
            <slot name="description"></slot>
          </div>
        </div>

        <div class="item__end" part="price">
          <div class="item__price-currency">
            <slot name="currency"></slot>
          </div>

          <div class="item__price-text">
            <div class="item__price">
              <slot name="price"></slot>
            </div>
            <div class="item__price-description">
              <slot name="price-description"></slot>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
