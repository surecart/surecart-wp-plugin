import { Component, h, Event, EventEmitter, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { LineItem } from '../../../../types';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-cart-header',
  styleUrl: 'sc-cart-header.scss',
  shadow: true,
})
export class ScCartHeader {
  @Prop() lineItems: Array<LineItem>;
  @Event() scCloseCart: EventEmitter<void>;

  /** Count the number of items in the cart. */
  getItemsCount() {
    const items = this.lineItems || [];
    let count = 0;
    items.forEach(item => {
      count = count + item?.quantity;
    });
    return count;
  }

  render() {
    return (
      <div class="cart-header">
        <sc-icon
          class="cart__close"
          name="arrow-right"
          onClick={() => this.scCloseCart.emit()}
          onKeyDown={e => {
            if ('Enter' === e?.code || 'Space' === e?.code) {
              this.scCloseCart.emit();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={__('Close Cart', 'surecart')}
        ></sc-icon>
        <div class="cart-title">
          <slot />
        </div>
        <sc-tag size="small">{this?.getItemsCount?.() || 0}</sc-tag>
      </div>
    );
  }
}
openWormhole(ScCartHeader, ['lineItems'], false);
