import { Component, h, Prop, Event, EventEmitter, Element } from '@stencil/core';
import { __, _n, sprintf } from '@wordpress/i18n';
import { isRtl } from '../../../functions/page-align';
import { Fee, ImageAttributes } from '../../../types';

/**
 * @part base - The component base
 * @part product-line-item - The product line item
 * @part image - The product image
 * @part text - The product text
 * @part title - The product title
 * @part suffix - The product suffix
 * @part price - The product price
 * @part price__amount - The product price amount
 * @part price__description - The product price description
 * @part price__scratch - The product price scratch
 * @part static-quantity - The product static quantity
 * @part remove-icon__base - The product remove icon
 * @part quantity - The product quantity
 * @part quantity__minus - The product quantity minus
 * @part quantity__minus-icon - The product quantity minus icon
 * @part quantity__plus - The product quantity plus
 * @part quantity__plus-icon - The product quantity plus icon
 * @part quantity__input - The product quantity input
 * @part line-item__price-description - The line item price description
 */
@Component({
  tag: 'sc-product-line-item',
  styleUrl: 'sc-product-line-item.scss',
  shadow: true,
})
export class ScProductLineItem {
  @Element() el: HTMLScProductLineItemElement;

  /** Image attributes. */
  @Prop() image: ImageAttributes;

  /** Product name */
  @Prop() name: string;

  /** Product monetary amount */
  @Prop() amount: string;

  /** The line item scratch amount */
  @Prop() scratch: string;

  /** Product display amount */
  @Prop() displayAmount: string;

  /** Product scratch display amount */
  @Prop() scratchDisplayAmount: string;

  /** Product line item fees. */
  @Prop() fees: Fee[];

  /** Price name */
  @Prop() price?: string;

  /** Product variant label */
  @Prop() variant: string = '';

  /** Quantity */
  @Prop() quantity: number;

  /** Recurring interval (i.e. monthly, once, etc.) */
  @Prop() interval: string;

  /** Trial text */
  @Prop() trial: string;

  /** Is the line item removable */
  @Prop() removable: boolean;

  /** Can we select the quantity */
  @Prop() editable: boolean = true;

  /** The max allowed. */
  @Prop() max: number;

  /** The SKU. */
  @Prop() sku: string = '';

  /** The purchasable status display */
  @Prop() purchasableStatus: string;

  /** Emitted when the quantity changes. */
  @Event({ bubbles: false }) scUpdateQuantity: EventEmitter<number>;

  /** Emitted when the quantity changes. */
  @Event({ bubbles: false }) scRemove: EventEmitter<void>;

  render() {
    const isImageFallback = this.image?.type === 'fallback';
  
    return (
      <div class="base" part="base">
        <div
          part="product-line-item"
          class={{
            'item': true,
            'item--has-image': !!this.image?.src,
            'item--is-rtl': isRtl(),
            'product-line-item__editable': this.editable,
            'product-line-item__removable': this.removable,
          }}
        >
          {!!this.image?.src ? <img {...(this.image as any)} part={isImageFallback ? "placeholder__image" : "image" } class={isImageFallback ? "item__image-placeholder" : "item__image"} /> : <div class="item__image-placeholder" part="placeholder__image"></div>}
          <div class="item__text-container">
            <div class="item__row">
              <div class="item__title" part="title">
                <slot name="title">{this.name}</slot>
              </div>
              <div class="price" part="price__amount">
                {!!this.scratch && this.scratch !== this.amount && <span class="item__scratch-price">{this.scratch}</span>}
                {this.amount}
                <div class="price__description" part="price__description">
                  {this.interval}
                </div>
              </div>
            </div>

            <div class="item__row">
              <div class="item__description" part="description">
                {this.variant && <div>{this.variant}</div>}
                {this.price && <div>{this.price}</div>}
                {this.sku && (
                  <div>
                    {__('SKU:', 'surecart')} {this.sku}
                  </div>
                )}
                {!!this.purchasableStatus && <div>{this.purchasableStatus}</div>}
              </div>

              <div class="item__description" part="trial-fees">
                {!!this.trial && <div>{this.trial}</div>}
                {(this.fees || []).map(fee => {
                  return (
                    <div>
                      {fee?.display_amount} {fee?.description}
                    </div>
                  );
                })}
              </div>
            </div>

            <div class="item__row stick-bottom">
              {this.editable ? (
                <sc-quantity-select
                  max={this.max || Infinity}
                  exportparts="base:quantity, minus:quantity__minus, minus-icon:quantity__minus-icon, plus:quantity__plus, plus-icon:quantity__plus-icon, input:quantity__input"
                  clickEl={this.el}
                  quantity={this.quantity}
                  size="small"
                  onScChange={e => e.detail && this.scUpdateQuantity.emit(e.detail)}
                  aria-label={
                    /** translators: %1$s: product name, %2$s: product price name */
                    sprintf(__('Change Quantity - %1$s %2$s', 'surecart'), this.name, this.price)
                  }
                ></sc-quantity-select>
              ) : (
                <span class="item__description" part="static-quantity">
                  {__('Qty:', 'surecart')} {this.quantity}
                </span>
              )}
              {!!this.removable && (
                <div
                  class="item__remove-container"
                  onClick={() => this.scRemove.emit()}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      this.scRemove.emit();
                    }
                  }}
                  // translators: Remove Item - Product Name Product Price Name
                  aria-label={sprintf(__('Remove Item - %1$s %2$s', 'surecart'), this.name, this.price)}
                  tabIndex={0}
                >
                  <sc-icon exportparts="base:remove-icon__base" class="item__remove" name="x" />
                  <span class="item__remove-text">{__('Remove', 'surecart')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
