import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import { sprintf, __ } from '@wordpress/i18n';
import { speak } from '@wordpress/a11y';
import { isBumpInOrder } from '../../../../functions/line-items';
import { getFormattedPrice, intervalString } from '../../../../functions/price';
import { sizeImage } from '../../../../functions/media';
import { state as checkoutState } from '@store/checkout';

import { Bump, LineItemData, Price, Product } from '../../../../types';

@Component({
  tag: 'sc-order-bump',
  styleUrl: 'sc-order-bump.scss',
  shadow: true,
})
export class ScOrderBump {
  /** The bump */
  @Prop() bump: Bump;

  /** Should we show the controls */
  @Prop({ reflect: true }) showControl: boolean;

  @Prop() cdnRoot: string = window.scData?.cdn_root;

  /** Add line item event */
  @Event() scAddLineItem: EventEmitter<LineItemData>;

  /** Remove line item event */
  @Event() scRemoveLineItem: EventEmitter<LineItemData>;

  /** Update the line item. */
  updateLineItem(add: boolean) {
    const price_id = (this.bump.price as Price)?.id || (this.bump?.price as string);
    if (add) {
      this.scAddLineItem.emit({
        bump: this.bump?.id,
        price_id,
        quantity: 1,
      });
      speak(__('Order bump applied.', 'surecart'));
    } else {
      this.scRemoveLineItem.emit({
        price_id,
        quantity: 1,
      });
      speak(__('Order bump Removed.', 'surecart'));
    }
  }

  newPrice() {
    let amount = null;
    let initialAmount = (this.bump?.price as Price)?.amount || 0;

    if (this.bump?.amount_off) {
      amount = Math.max(0, initialAmount - this.bump?.amount_off);
    }
    if (this.bump?.percent_off) {
      const off = initialAmount * (this.bump?.percent_off / 100);
      amount = Math.max(0, initialAmount - off);
    }

    return amount;
  }

  renderInterval() {
    const interval = intervalString(this.bump?.price as Price, { labels: { interval: '/', period: __('for', 'surecart') } });
    if (!interval.trim().length) return null;
    return <span class="bump__interval">{interval}</span>;
  }

  renderPrice() {
    return (
      <div slot="description" class={{ 'bump__price': true, 'bump__price--has-discount': !!this.bump?.percent_off || !!this.bump?.amount_off }} part="price">
        <span
          aria-label={
            /** translators: %s: old price */
            sprintf(
              __('Originally priced at %s.', 'surecart'),
              getFormattedPrice({
                amount: (this.bump?.price as Price)?.amount,
                currency: (this.bump?.price as Price)?.currency,
              }),
            )
          }
        >
          <sc-format-number
            type="currency"
            class="bump__original-price"
            value={(this.bump?.price as Price)?.amount}
            currency={(this.bump?.price as Price)?.currency}
          ></sc-format-number>{' '}
        </span>
        <span
          aria-label={
            /** translators: %s: new price */
            sprintf(
              __('Now available for %s.', 'surecart'),
              this.newPrice() === 0
                ? __('Free', 'surecart')
                : this.newPrice() !== null &&
                    this.newPrice() > 0 &&
                    getFormattedPrice({
                      amount: this.newPrice(),
                      currency: (this.bump?.price as Price)?.currency,
                    }),
            )
          }
        >
          <span aria-hidden="true">
            {this.newPrice() === 0 && __('Free', 'surecart')}
            {this.newPrice() !== null && this.newPrice() > 0 && (
              <sc-format-number type="currency" class="bump__new-price" value={this.newPrice()} currency={(this.bump?.price as Price).currency} />
            )}
            {this.renderInterval()}
          </span>
        </span>
      </div>
    );
  }

  renderDiscount() {
    if (!!this.bump?.amount_off) {
      return (
        <div
          class="bump__tag"
          aria-label={
            /** translators: %1$s: amount off, %2$s: currency */
            sprintf(__('You save %1$s%2$s.', 'surecart'), this.bump?.amount_off, (this.bump?.price as Price).currency)
          }
        >
          <span aria-hidden="true">
            {__('Save', 'surecart')} <sc-format-number type="currency" value={-this.bump?.amount_off} currency={(this.bump?.price as Price).currency}></sc-format-number>
          </span>
        </div>
      );
    }

    if (!!this.bump?.percent_off) {
      return (
        <div
          class="bump__tag"
          aria-label={
            /** translators: %s: amount percent off */
            sprintf(__('You save %s%%.', 'surecart'), this.bump?.percent_off)
          }
        >
          <span aria-hidden="true">{sprintf(__('Save %s%%', 'surecart'), this.bump?.percent_off)}</span>
        </div>
      );
    }
  }

  render() {
    const product = (this.bump?.price as Price)?.product as Product;

    return (
      <sc-choice
        value={this.bump?.id}
        type="checkbox"
        showControl={this.showControl}
        checked={isBumpInOrder(this.bump, checkoutState?.checkout)}
        onScChange={e => this.updateLineItem(e.target.checked)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopImmediatePropagation();
            this.updateLineItem(!isBumpInOrder(this.bump, checkoutState?.checkout));
          }
        }}
        exportparts="base, control, checked-icon, title"
      >
        <div part="base-content" class="bump">
          <div class="bump__text">
            <div
              class="bump__title"
              aria-label={sprintf(
                /* translators: %s: order bump name */
                __('Product: %s.', 'surecart'),
                this.bump?.metadata?.cta || this.bump?.name || product?.name,
              )}
            >
              <span aria-hidden="true">{this.bump?.metadata?.cta || this.bump?.name || product?.name}</span>
            </div>
            <div class="bump__amount">
              <span>{this.renderPrice()}</span>
              <span>{this.renderDiscount()}</span>
            </div>
          </div>
        </div>

        {this.bump?.metadata?.description && (
          <div slot="footer" class="bump__product--wrapper">
            <sc-divider style={{ '--spacing': 'var(--sc-spacing-medium)' }}></sc-divider>
            <div class="bump__product">
              {!!product?.image_url && <img src={sizeImage(product?.image_url, 130)} class="bump__image" />}
              <div class="bump__product-text">
                {!!this.bump?.metadata?.cta && (
                  <div class="bump__product-title" aria-hidden="true">
                    {this.bump.name || product?.name}
                  </div>
                )}

                {!!this.bump?.metadata?.description && (
                  <div
                    class="bump__product-description"
                    aria-label={sprintf(
                      /* translators: %s: Product description */
                      __('Product description: %s.', 'surecart'),
                      this.bump?.metadata?.description,
                    )}
                  >
                    <span aria-hidden="true">{this.bump?.metadata?.description}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </sc-choice>
    );
  }
}
