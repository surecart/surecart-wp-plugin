import { Component, Event, EventEmitter, Fragment, h, Prop } from '@stencil/core';
import { sprintf, __ } from '@wordpress/i18n';
import { isBumpInOrder } from '../../../../functions/line-items';
import { intervalString } from '../../../../functions/price';

import { Bump, Checkout, LineItemData, Price, Product } from '../../../../types';

@Component({
  tag: 'sc-order-bump',
  styleUrl: 'sc-order-bump.scss',
  shadow: true,
})
export class ScOrderBump {
  /** The bump */
  @Prop() bump: Bump;

  /** The checkout */
  @Prop() checkout: Checkout;

  /** Should we show the label */
  @Prop() showLabel: boolean;

  /** Should we show the controls */
  @Prop() showControl: boolean;

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
    } else {
      this.scRemoveLineItem.emit({
        price_id,
        quantity: 1,
      });
    }
  }

  newPrice() {
    let amount = (this.bump?.price as Price).amount || 0;

    if (this.bump?.amount_off) {
      amount = Math.max(0, amount - this.bump?.amount_off);
    }
    if (this.bump?.percent_off) {
      const off = amount * (this.bump?.percent_off / 100);
      amount = Math.max(0, amount - off);
    }
    return amount;
  }

  renderPrice() {
    return (
      <div slot="description" class={{ 'bump__price': true, 'bump__price--has-discount': !!this.bump?.percent_off || !!this.bump?.amount_off }} part="price">
        <sc-format-number
          type="currency"
          class="bump__original-price"
          value={(this.bump?.price as Price).amount}
          currency={(this.bump?.price as Price).currency}
        ></sc-format-number>{' '}
        {this.newPrice() === 0 ? (
          __('Free', 'surecart')
        ) : (
          <Fragment>
            <sc-format-number type="currency" class="bump__new-price" value={this.newPrice()} currency={(this.bump?.price as Price).currency} />
            <span class="bump__interval">{intervalString(this.bump?.price as Price, { labels: { interval: '/', period: __('for', 'surecart') } })}</span>
          </Fragment>
        )}
      </div>
    );
  }

  renderDiscount() {
    if (!!this.bump?.amount_off) {
      return (
        <div class="bump__tag">
          {__('Save', 'surecart')} <sc-format-number type="currency" value={-this.bump?.amount_off} currency={(this.bump?.price as Price).currency}></sc-format-number>
        </div>
      );
    }

    if (!!this.bump?.percent_off) {
      return <div class="bump__tag">{sprintf(__('Save %s%%', 'surecart'), this.bump?.percent_off)}</div>;
    }
  }

  render() {
    const product = (this.bump?.price as Price)?.product as Product;
    return (
      <sc-choice
        value={this.bump?.id}
        type="checkbox"
        showLabel={this.showLabel}
        showControl={this.showControl}
        checked={isBumpInOrder(this.bump, this.checkout)}
        onScChange={e => this.updateLineItem(e.target.checked)}
        exportparts="base, control, checked-icon, title"
      >
        <div part="base-content" class="bump">
          <div class="bump__text">
            <div class="bump__title">{this.bump?.metadata?.cta || this.bump.name || product?.name}</div>
            {this.renderPrice()}
          </div>
          {this.renderDiscount()}
        </div>

        {this.bump?.metadata?.description && (
          <div slot="footer">
            <sc-divider style={{ '--spacing': 'var(--sc-spacing-medium)' }}></sc-divider>
            <div class="bump__product">
              {!!product?.image_url && <img src={product.image_url} class="bump__image" />}
              <div class="bump__product-text">
                {!!this.bump?.metadata?.cta && <div class="bump__product-title">{this.bump.name || product?.name}</div>}
                {!!this.bump?.metadata?.description && <div class="bump__product-description">{this.bump?.metadata?.description}</div>}
              </div>
            </div>
          </div>
        )}
      </sc-choice>
    );
  }
}
