import { Component, h, Prop, Event, EventEmitter, Element, State } from '@stencil/core';
import { __, sprintf } from '@wordpress/i18n';
import { isRtl } from '../../../functions/page-align';
import { Fee, ImageAttributes, LineItem, Price, Product, Variant } from '../../../types';

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
 * @part savings - The savings badge
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

  /** Whether the components are expanded. */
  @State() expanded: boolean = true;

  /** Emitted when the quantity changes. */
  @Event({ bubbles: false }) scUpdateQuantity: EventEmitter<number>;

  /** Emitted when the item is removed. */
  @Event({ bubbles: false }) scRemove: EventEmitter<void>;

  /** Get the bundle price display amount. */
  private getBundleAmount(): string {
    // Use the price amount from the bundle price, or sum component totals.
    if (this.item?.ad_hoc_display_amount) {
      return this.item.ad_hoc_display_amount;
    }
    return this.item?.subtotal_display_amount || '';
  }

  /** Get the total from components (the actual charged amount). */
  private getComponentsTotal(): string {
    if (!this.components?.length) {
      return this.getBundleAmount();
    }

    // The parent subtotal is 0, so we sum component totals for display.
    const total = this.components.reduce((sum, c) => sum + (c?.subtotal_amount || 0), 0);
    // If parent has a subtotal (non-zero), prefer that.
    if (this.item?.subtotal_amount > 0) {
      return this.item.subtotal_display_amount;
    }
    // Otherwise use first component's currency formatting as a reference.
    return this.components[0]?.subtotal_display_amount ? this.item?.total_display_amount : '';
  }

  render() {
    const price = this.item?.price as Price;
    const product = price?.product as Product;
    const image = this.item?.image;
    const isImageFallback = image?.type === 'fallback';
    const amount = this.getBundleAmount();
    const savingsAmount = price?.bundle_savings_display_amount;

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
                {!!this.item?.scratch_display_amount && this.item?.scratch_display_amount !== amount && (
                  <span class="item__scratch-price">{this.item.scratch_display_amount}</span>
                )}
                {amount}
                <div class="price__description">
                  {price?.short_interval_text} {price?.short_interval_count_text}
                </div>
              </div>
            </div>

            {/* Row 2: Price name + Savings badge */}
            <div class="item__row">
              <div class="item__description">
                {price?.name && <div>{price.name}</div>}
                {!!this.item?.purchasable_status_display && <div>{this.item.purchasable_status_display}</div>}
              </div>
              {!!savingsAmount && (
                <div class="bundle-savings" part="savings">
                  {sprintf(
                    /** translators: %s: savings amount */
                    __('You save %s', 'surecart'),
                    savingsAmount,
                  )}
                </div>
              )}
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

            {/* Row 4: Bundle components */}
            {!!this.components?.length && (
              <div class="bundle-components" part="components">
                <button
                  class="bundle-components__toggle"
                  onClick={() => {
                    this.expanded = !this.expanded;
                  }}
                  aria-expanded={this.expanded ? 'true' : 'false'}
                >
                  <span>
                    {sprintf(
                      /** translators: %d: number of items */
                      __('Includes %d items', 'surecart'),
                      this.components.length,
                    )}
                  </span>
                  <sc-icon name={this.expanded ? 'chevron-up' : 'chevron-down'} />
                </button>

                {this.expanded && (
                  <div class="bundle-components__list">
                    {this.components.map(component => {
                      const componentPrice = component?.price as Price;
                      const componentProduct = componentPrice?.product as Product;
                      const componentImage = component?.image;

                      return (
                        <div class="bundle-component" part="component">
                          {!!componentImage?.src && <img {...(componentImage as any)} class="bundle-component__image" />}
                          <div class="bundle-component__info">
                            <span class="bundle-component__name">{componentProduct?.name}</span>
                            {!!component?.variant_display_options && <span class="bundle-component__variant">{component.variant_display_options}</span>}
                          </div>
                          {component?.quantity > 1 && <span class="bundle-component__qty">&times; {component.quantity}</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
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
