import { Component, h, Prop } from '@stencil/core';
import { sprintf, __, _x } from '@wordpress/i18n';
import { speak } from '@wordpress/a11y';
import { intervalString } from '../../../../functions/price';
import { state as checkoutState } from '@store/checkout';

import { Bump, Price, Product } from '../../../../types';
import { addCheckoutLineItem, removeCheckoutLineItem, trackOrderBump } from '@store/checkout/mutations';

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

  /** The bump line item */
  lineItem() {
    return checkoutState?.checkout?.line_items?.data?.find(item => item?.bump === this.bump?.id);
  }

  /** Update the line item. */
  updateLineItem() {
    const price = (this.bump.price as Price)?.id || (this.bump?.price as string);

    if (this.lineItem()) {
      removeCheckoutLineItem(this.lineItem()?.id);
      speak(__('Order bump Removed.', 'surecart'));
      return;
    }

    addCheckoutLineItem({
      bump: this.bump?.id,
      price,
      quantity: 1,
    });
    speak(__('Order bump applied.', 'surecart'));
  }

  componentDidLoad() {
    trackOrderBump(this.bump?.id);
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
            sprintf(__('Originally priced at %s.', 'surecart'), this.bump?.subtotal_display_amount)
          }
          class="bump__original-price"
        >
          {this.bump?.subtotal_display_amount}
        </span>

        {(!!this.bump?.percent_off || !!this.bump?.amount_off) && (
          <span>
            <span aria-hidden="true">
              {this.bump?.total_amount === 0 && __('Free', 'surecart')}
              {this.bump?.total_amount > 0 && <span class="bump__new-price">{this.bump?.total_display_amount}</span>}
              {this.renderInterval()}
            </span>
          </span>
        )}
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
            {_x('Save', 'Save money', 'surecart')} {this.bump?.amount_off_display_amount}
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
          <span aria-hidden="true">
            {sprintf(
              /** translators: %s: amount percent off */
              _x('Save %s%%', 'Save money', 'surecart'),
              this.bump?.percent_off,
            )}
          </span>
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
        checked={!!this.lineItem()}
        onClick={e => {
          e.preventDefault();
          e.stopImmediatePropagation();
          this.updateLineItem();
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopImmediatePropagation();
            this.updateLineItem();
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
              {this.renderPrice()}
              {this.renderDiscount()}
            </div>
          </div>
        </div>

        {this.bump?.metadata?.description && (
          <div slot="footer" class="bump__product--wrapper">
            <sc-divider style={{ '--spacing': 'var(--sc-spacing-medium)' }}></sc-divider>
            <div class="bump__product">
              {!!product?.line_item_image?.src && <img {...(product?.line_item_image as any)} class="bump__image" />}
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
