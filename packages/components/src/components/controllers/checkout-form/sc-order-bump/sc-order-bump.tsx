import { Component, Element, h, Prop, State } from '@stencil/core';
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
  @Element() el: HTMLElement;

  /** The bump */
  @Prop() bump: Bump;

  /** Should we show the controls (classic design) */
  @Prop({ reflect: true }) showControl: boolean;

  /** Loading state */
  @State() loading: boolean = false;

  /** Cached design mode */
  private isModern: boolean = true;

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
      } else {
        await addCheckoutLineItem({
          bump: this.bump?.id,
          price,
          quantity: 1,
        });
        speak(__('Order bump applied.', 'surecart'));
      }
    } catch (e) {
      console.error('[sc-order-bump] updateLineItem failed:', e);
      speak(__('Something went wrong. Please try again.', 'surecart'));
    } finally {
      this.loading = false;
    }
  }

  componentWillLoad() {
    this.isModern = !!(window as any).scData?.modern_order_bump;
    this.el.setAttribute('data-design', this.isModern ? 'modern' : 'classic');
  }

  componentDidLoad() {
    trackOrderBump(this.bump?.id);
  }

  renderInterval() {
    const interval = intervalString(this.bump?.price as Price, { labels: { interval: '/', period: __('for', 'surecart') } });
    if (!interval.trim().length) return null;
    return <span class="bump__interval">{interval}</span>;
  }

  renderDiscount() {
    if (!!this.bump?.amount_off) {
      return (
        <div
          class="bump__tag"
          part="tag"
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
      const percent = `${this.bump.percent_off}%`;
      return (
        <div
          class="bump__tag"
          part="tag"
          aria-label={
            /** translators: %s is the discount percentage (e.g. "10%"). */
            sprintf(__('You save %s.', 'surecart'), percent)
          }
        >
          <span aria-hidden="true">
            {sprintf(
              /** translators: %s is the discount percentage (e.g. "10%"). */
              _x('Save %s', 'Save money', 'surecart'),
              percent,
            )}
          </span>
        </div>
      );
    }
  }

  /** Modern price (no slot) */
  renderModernPrice() {
    return (
      <div class={{ 'bump__price': true, 'bump__price--has-discount': !!this.bump?.percent_off || !!this.bump?.amount_off }} part="price">
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

  /** Classic price (with slot="description") */
  renderClassicPrice() {
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

  /** Modern design: rounded button, inline image, no checkbox */
  renderModern() {
    const product = (this.bump?.price as Price)?.product as Product;
    const lineItem = this.lineItem();
    return (
      <sc-choice value={this.bump?.id} type="checkbox" showControl={false} checked={!!lineItem} exportparts="base:choice__base, content:choice__content">
        <div
          part="base-content"
          class="bump"
          onClick={e => e.stopPropagation()}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') e.stopPropagation();
          }}
        >
          {!!product?.line_item_image?.src && <img {...(product?.line_item_image as any)} class="bump__image" part="image" />}
          <div class="bump__text" part="text">
            <div
              class="bump__title"
              part="title"
              aria-label={sprintf(
                /* translators: %s: order bump name */
                __('Product: %s.', 'surecart'),
                this.bump?.name || product?.name,
              )}
            >
              <span aria-hidden="true">{this.bump?.name || product?.name}</span>
            </div>
            {!!this.bump?.metadata?.cta && (
              <div class="bump__cta" part="cta">
                <span>{this.bump?.metadata?.cta}</span>
              </div>
            )}
            <div class="bump__amount" part="amount">
              {this.renderModernPrice()}
              {this.renderDiscount()}
            </div>
            {!!this.bump?.metadata?.description && (
              <div
                class="bump__description"
                part="description"
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
          <button
            type="button"
            class={{
              'bump__button': true,
              'bump__button--checked': !!lineItem,
              'bump__button--loading': this.loading,
            }}
            part="button"
            onClick={() => this.updateLineItem()}
            aria-label={lineItem ? __('Remove from order', 'surecart') : __('Add to order', 'surecart')}
            aria-pressed={!!lineItem}
            aria-busy={this.loading}
          >
            {this.loading ? <sc-spinner /> : <sc-icon name={lineItem ? 'check' : 'plus'} />}
          </button>
        </div>
      </sc-choice>
    );
  }

  /** Classic design: checkbox control, footer with divider + image + description */
  renderClassic() {
    const product = (this.bump?.price as Price)?.product as Product;
    return (
      <sc-choice
        value={this.bump?.id}
        type="checkbox"
        showControl={this.showControl}
        checked={!!this.lineItem()}
        disabled={this.loading}
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
              {this.renderClassicPrice()}
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
                      this.bump?.rendered_description,
                    )}
                  >
                    <span aria-hidden="true" innerHTML={this.bump?.rendered_description}></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </sc-choice>
    );
  }

  render() {
    return this.isModern ? this.renderModern() : this.renderClassic();
  }
}
