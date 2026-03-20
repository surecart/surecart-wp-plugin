import { Component, h, Prop, State } from '@stencil/core';
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

  /** Loading state */
  @State() loading: boolean = false;

  /** The bump line item */
  lineItem() {
    return checkoutState?.checkout?.line_items?.data?.find(item => item?.bump === this.bump?.id);
  }

  /** Update the line item. */
  async updateLineItem() {
    if (this.loading) return;

    const price = (this.bump.price as Price)?.id || (this.bump?.price as string);
    const lineItem = this.lineItem();

    this.loading = true;
    try {
      if (lineItem) {
        await removeCheckoutLineItem(lineItem.id);
        speak(__('Order bump Removed.', 'surecart'));
        return;
      }

      await addCheckoutLineItem({
        bump: this.bump?.id,
        price,
        quantity: 1,
      });
      speak(__('Order bump applied.', 'surecart'));
    } finally {
      this.loading = false;
    }
  }

  componentDidLoad() {
    trackOrderBump(this.bump?.id);
  }

  renderInterval() {
    const interval = intervalString(this.bump?.price as Price, { labels: { interval: '/', period: __('for', 'surecart') } });
    if (!interval.trim().length) return null;
    return <span class="bump__interval">{interval}</span>;
  }

  renderPrice() {
    return (
      <div slot="description" class={{ 'bump__price': true, 'bump__price--has-discount': !!this.bump?.percent_off || !!this.bump?.amount_off }} part="price">
        {!!(this.bump?.percent_off || this.bump?.amount_off) && (
          <span
            aria-label={
              /** translators: %s: old price */
              sprintf(__('Originally priced at %s.', 'surecart'), this.bump?.subtotal_display_amount)
            }
            class="bump__original-price"
          >
            {this.bump?.subtotal_display_amount}
          </span>
        )}

        <span>
          <span aria-hidden="true">
            {this.bump?.total_amount === 0 && __('Free', 'surecart')}
            {this.bump?.total_amount > 0 && <span class="bump__new-price">{this.bump?.total_display_amount}</span>}
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
    const lineItem = this.lineItem();
    return (
      <sc-choice
        value={this.bump?.id}
        type="checkbox"
        showControl={false}
        checked={!!lineItem}
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
        exportparts="base, title"
      >
        {!!this.bump?.metadata?.cta && (
          <div
            slot="header"
            class="bump__header"
            aria-label={sprintf(
              /* translators: %s: order bump CTA */
              __('Product: %s.', 'surecart'),
              this.bump?.metadata?.cta,
            )}
          >
            <span aria-hidden="true">{this.bump?.metadata?.cta}</span>
          </div>
        )}
        <div part="base-content" class="bump">
          {!!product?.line_item_image?.src && <img {...(product?.line_item_image as any)} class="bump__image" />}
          <div class="bump__text">
            <div
              class="bump__title"
              aria-label={sprintf(
                /* translators: %s: order bump name */
                __('Product: %s.', 'surecart'),
                this.bump?.name || product?.name,
              )}
            >
              <span aria-hidden="true">{this.bump?.name || product?.name}</span>
            </div>
            <div class="bump__amount">
              {this.renderPrice()}
              {this.renderDiscount()}
            </div>
            {!!this.bump?.metadata?.description && (
              <div
                class="bump__description"
                aria-label={sprintf(
                  /* translators: %s: Product description */
                  __('Product description: %s.', 'surecart'),
                  this.bump?.rendered_description,
                )}
              >
                <span aria-hidden="true" innerHTML={this.bump?.rendered_description}></span>
              </div>
            )}
          </div>
          <div
            class={{
              'bump__button': true,
              'bump__button--checked': !!lineItem,
              'bump__button--loading': this.loading,
            }}
            aria-hidden="true"
          >
            {this.loading ? <sc-spinner /> : <sc-icon name={lineItem ? 'check' : 'plus'} />}
          </div>
        </div>
      </sc-choice>
    );
  }
}
