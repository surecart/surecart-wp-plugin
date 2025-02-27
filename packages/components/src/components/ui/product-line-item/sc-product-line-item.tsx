import { Component, h, Prop, Event, EventEmitter, Element, Fragment } from '@stencil/core';
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

  /** Price name */
  @Prop() priceName?: string;

  /** Product variant label */
  @Prop() variantLabel: string = '';

  /** Quantity */
  @Prop() quantity: number;

  /** Product monetary amount */
  @Prop() amount: number;

  /** Product line item fees. */
  @Prop() fees: Fee[];

  /** Is the setup fee not included in the free trial? */
  @Prop() setupFeeTrialEnabled: boolean = true;

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
  @Prop() max: number;

  /** The SKU. */
  @Prop() sku: string = '';

  /** The purchasable status display */
  @Prop() purchasableStatusDisplay: string;

  /** Emitted when the quantity changes. */
  @Event({ bubbles: false }) scUpdateQuantity: EventEmitter<number>;

  /** Emitted when the quantity changes. */
  @Event({ bubbles: false }) scRemove: EventEmitter<void>;

  renderPrice() {
    const setupFee = (this.fees || []).find(fee => fee.fee_type === 'setup');
    if (this.trialDurationDays) {
      return (
        <div class="price" part="price__amount">
          {!!setupFee && !this.setupFeeTrialEnabled ? (
            <Fragment>
              {setupFee?.description} <sc-format-number part="price__amount" type="currency" currency={this.currency} value={setupFee.amount}></sc-format-number>
            </Fragment>
          ) : (
            sprintf(_n('%d day free', '%d days free', this.trialDurationDays, 'surecart'), this.trialDurationDays)
          )}
        </div>
      );
    }

    return (
      <div class="price" part="price__amount">
        {!!this.scratchAmount && this.scratchAmount !== this.amount && (
          <Fragment>
            <sc-format-number class="item__scratch-price" type="currency" currency={this.currency} value={this.scratchAmount}></sc-format-number>{' '}
          </Fragment>
        )}
        <sc-format-number type="currency" currency={this.currency} value={this.amount}></sc-format-number>
      </div>
    );
  }

  renderInterval() {
    const setupFee = (this.fees || []).find(fee => fee.fee_type === 'setup');
    if (this.trialDurationDays) {
      return (
        <div class="price__description" part="price__description">
          {
            /** translators: 30 days free, Then $99 per month. */
            __('Then', 'surecart')
          }{' '}
          {!!this.scratchAmount && this.scratchAmount > this.amount && (
            <Fragment>
              <sc-format-number class="item__scratch-price" part="price__scratch" type="currency" currency={this.currency} value={this.scratchAmount}></sc-format-number>{' '}
            </Fragment>
          )}
          <sc-format-number part="price__amount" type="currency" currency={this.currency} value={this.amount}></sc-format-number> {!!this.interval && this.interval}
          {!!setupFee && !this.setupFeeTrialEnabled && sprintf(_n('starting in %d day', 'starting in %d days', this.trialDurationDays, 'surecart'), this.trialDurationDays)}
        </div>
      );
    }

    return (
      !!this.interval && (
        <div class="price__description" part="price__description">
          {this.interval}
        </div>
      )
    );
  }

  renderPurchasableStatus() {
    if (!this.purchasableStatusDisplay) return null;

    return (
      <div class="product-line-item__purchasable-status" part="price__amount">
        {this.purchasableStatusDisplay}
      </div>
    );
  }

  render() {
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
          {!!this.image?.src ? <img {...(this.image as any)} part="image" class="item__image" /> : <div class="item__image-placeholder"></div>}
          <div class="item__text-container">
            <div class="item__row">
              <div class="item__title" part="title">
                <slot name="title">{this.name}</slot>
              </div>
              {this.renderPrice()}
            </div>

            {(this.priceName || this.variantLabel || this.sku || this.interval) && (
              <div class="item__row">
                <div class="item__description item__price-variant" part="description">
                  {(() => {
                    // Create an array of elements to display
                    const elements = [];

                    if (this.variantLabel) {
                      elements.push(<span>{this.variantLabel}</span>);
                    }

                    if (this.priceName) {
                      elements.push(<span>{this.priceName}</span>);
                    }

                    if (this.sku) {
                      elements.push(
                        <span>
                          {__('SKU:', 'surecart')} {this.sku}
                        </span>,
                      );
                    }

                    // Join elements with pipe separator
                    return elements.map((element, index) => (
                      <Fragment>
                        {element}
                        {index < elements.length - 1 && <span> &bull; </span>}
                      </Fragment>
                    ));
                  })()}
                </div>
                {this.renderInterval()}
              </div>
            )}

            {(this.fees || []).map(fee => {
              if (this.trialDurationDays && !this.setupFeeTrialEnabled && fee.fee_type === 'setup') return null;
              return (
                <div class="item__row">
                  <div></div>
                  <div class="price__description" part="description">
                    <sc-format-number slot="price-description" type="currency" value={fee?.amount} currency={this.currency || 'usd'} /> {fee?.description}
                  </div>
                </div>
              );
            })}

            {/*
            <div class="item__row">
              <div class="item__text" part="text">
                <div class="item__text-details">
                  <div class="item__title" part="title">
                    <slot name="title">{this.name}</slot>
                  </div>
                  <div class="item__description item__price-variant" part="description">
                    {!!this.variantLabel && <div>{this.variantLabel}</div>}
                    {!!this.priceName && <div>{this.priceName}</div>}
                    {!!this.sku && (
                      <div>
                        {__('SKU:', 'surecart')} {this.sku}
                      </div>
                    )}
                  </div>
                  {!this.editable && this.quantity > 1 && (
                    <span class="item__description" part="static-quantity">
                      {__('Qty:', 'surecart')} {this.quantity}
                    </span>
                  )}
                </div>
              </div>
              <div class="item__suffix" part="suffix">
                <div class="item__price" part="price">
                  {this.renderPriceAndInterval()}
                  {this.renderPurchasableStatus()}
                </div>
              </div>
            </div> */}

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
                    sprintf(__('Change Quantity - %1$s %2$s', 'surecart'), this.name, this.priceName)
                  }
                ></sc-quantity-select>
              ) : (
                this.quantity > 1 && (
                  <span class="item__description" part="static-quantity">
                    {__('Qty:', 'surecart')} {this.quantity}
                  </span>
                )
              )}
              {!!this.removable && (
                <div class="item__remove-container">
                  <sc-icon
                    exportparts="base:remove-icon__base"
                    class="item__remove"
                    name="x"
                    onClick={() => this.scRemove.emit()}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        this.scRemove.emit();
                      }
                    }}
                    tabindex="0"
                    // translators: Remove Item - Product Name Product Price Name
                    aria-label={sprintf(__('Remove Item - %1$s %2$s', 'surecart'), this.name, this.priceName)}
                  ></sc-icon>
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
