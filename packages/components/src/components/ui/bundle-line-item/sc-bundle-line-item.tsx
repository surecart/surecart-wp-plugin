import { Component, h, Prop, Event, EventEmitter, Element } from '@stencil/core';
import { __, sprintf } from '@wordpress/i18n';
import { isRtl } from '../../../functions/page-align';
import { LineItem, Price, Product } from '../../../types';

/**
 * Renders a bundle parent line item with its component items nested inside.
 *
 * @part base - The component base
 * @part bundle-line-item - The bundle line item wrapper
 * @part image - The bundle product image
 * @part title - The bundle product title
 * @part price - The bundle price
 * @part components - The bundle components list
 * @part component - A single bundle component
 */
@Component({
  tag: 'sc-bundle-line-item',
  styleUrl: 'sc-bundle-line-item.scss',
  shadow: true,
})
export class ScBundleLineItem {
  @Element() el: HTMLElement;

  /** The bundle parent line item. */
  @Prop() item: LineItem;

  /** The component line items. */
  @Prop() components: LineItem[] = [];

  /** Is the line item editable? */
  @Prop() editable: boolean = false;

  /** Is the line item removable? */
  @Prop() removable: boolean = false;

  /** Max quantity. */
  @Prop() max: number;

  /** Emitted when the quantity changes. */
  @Event({ bubbles: false }) scUpdateQuantity: EventEmitter<number>;

  /** Emitted when the item is removed. */
  @Event({ bubbles: false }) scRemove: EventEmitter<void>;

  /** Get the bundle price display amount. */
  private getBundleAmount(): string {
    // The parent line item's subtotal is 0 on the API (the bundle price is
    // distributed across components). Show the bundle price's display amount
    // multiplied by quantity — that is what the customer pays for this line.
    if (this.item?.ad_hoc_display_amount) {
      return this.item.ad_hoc_display_amount;
    }
    const price = this.item?.price as Price;
    return price?.display_amount || this.item?.subtotal_display_amount || '';
  }

  render() {
    const price = this.item?.price as Price;
    const product = price?.product as Product;
    const image = this.item?.image;
    const isImageFallback = image?.type === 'fallback';
    const amount = this.getBundleAmount();

    return (
      <div class="base" part="base">
        <div
          part="bundle-line-item"
          class={{
            'item': true,
            'item--has-image': !!image?.src,
            'item--is-rtl': isRtl(),
          }}
        >
          {!!image?.src ? (
            <img {...(image as any)} part={isImageFallback ? 'placeholder__image' : 'image'} class={isImageFallback ? 'item__image-placeholder' : 'item__image'} />
          ) : (
            <div class="item__image-placeholder" part="placeholder__image"></div>
          )}

          <div class="item__text-container">
            {/* Row 1: Title + Price */}
            <div class="item__row">
              <div class="item__title" part="title">
                {product?.name}
              </div>
              <div class="price" part="price">
                {!!this.item?.scratch_display_amount && this.item?.scratch_display_amount !== amount && <span class="item__scratch-price">{this.item.scratch_display_amount}</span>}
                {amount}
                <div class="price__description">
                  {price?.short_interval_text} {price?.short_interval_count_text}
                </div>
              </div>
            </div>

            {/* Row 2: Price name */}
            <div class="item__row">
              <div class="item__description">
                {price?.name && <div>{price.name}</div>}
                {!!this.item?.purchasable_status_display && <div>{this.item.purchasable_status_display}</div>}
              </div>
            </div>

            {/* Row 3: Trial + Fees */}
            {(!!price?.trial_text || !!(this.item?.fees?.data || []).length) && (
              <div class="item__row">
                <div class="item__description">
                  {!!price?.trial_text && <div>{price.trial_text}</div>}
                  {(this.item?.fees?.data || []).map(fee => (
                    <div>
                      {fee?.display_amount} {fee?.description}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bundle components — plain list, mirrors the next-gen
                cart-line-item-bundle-components block. Each row: label on
                the left, `× N` pinned right. `× N` is always rendered
                (even at qty 1) so every row has the same shape — no layout
                jitter between mixed-quantity components. The component
                line item's quantity is the total being shipped
                (bundle_qty × per-bundle component qty). */}
            {!!this.components?.length && (
              <div class="bundle-components" part="components">
                {this.components.map(component => {
                  const componentPrice = component?.price as Price;
                  const componentProduct = componentPrice?.product as Product;
                  const name = componentProduct?.name || '';
                  const variants = component?.variant_display_options || '';
                  const qty = Math.max(Number(component?.quantity) || 1, 1);
                  const label = variants ? `${name} - ${variants}` : name;
                  if (!label) return null;
                  return (
                    <div class="bundle-component" part="component">
                      <span class="bundle-component__label">{label}</span>
                      <span class="bundle-component__qty">× {qty}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Row 5: Quantity + Remove */}
            <div class="item__row stick-bottom">
              {this.editable ? (
                <sc-quantity-select
                  max={this.max || Infinity}
                  clickEl={this.el}
                  quantity={this.item?.quantity}
                  size="small"
                  onScChange={e => e.detail && this.scUpdateQuantity.emit(e.detail)}
                  aria-label={sprintf(__('Change Quantity - %1$s', 'surecart'), product?.name)}
                  productName={product?.name}
                ></sc-quantity-select>
              ) : (
                <span class="item__description" part="static-quantity">
                  {__('Qty:', 'surecart')} {this.item?.quantity}
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
                  aria-label={sprintf(__('Remove Item - %1$s', 'surecart'), product?.name)}
                  tabIndex={0}
                >
                  <sc-icon class="item__remove" name="x" />
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
