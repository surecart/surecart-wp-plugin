import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

import { hasSubscription } from '../../../../functions/line-items';
import { intervalString } from '../../../../functions/price';
import { LineItem, LineItemData, Checkout, PriceChoice, Prices, Product } from '../../../../types';

@Component({
  tag: 'sc-line-items',
  styleUrl: 'sc-line-items.css',
  shadow: true,
})
export class ScLineItems {
  @Prop() order: Checkout;
  @Prop() busy: boolean;
  @Prop() prices: Prices;
  @Prop() editable: boolean;
  @Prop() removable: boolean;
  @Prop() editLineItems: boolean = true;
  @Prop() removeLineItems: boolean = true;
  @Prop() lockedChoices: Array<PriceChoice> = [];

  /** Update the line item. */
  @Event() scUpdateLineItem: EventEmitter<LineItemData>;

  /** Remove the line item. */
  @Event() scRemoveLineItem: EventEmitter<LineItemData>;

  /** Update quantity for this line item. */
  updateQuantity(item: LineItem, quantity: number) {
    this.scUpdateLineItem.emit({ price_id: item.price.id, quantity });
  }

  removeLineItem(item: LineItem) {
    this.scRemoveLineItem.emit({ price_id: item.price.id, quantity: 1 });
  }

  /** Only append price name if there's more than one product price in the session. */
  getName(item: LineItem) {
    const otherPrices = Object.keys(this.prices || {}).filter(key => {
      const price = this.prices[key];
      // @ts-ignore
      return price.product === item.price.product.id;
    });

    let name = '';
    if (otherPrices.length > 1) {
      name = `${(item?.price?.product as Product)?.name} \u2013 ${item?.price?.name}`;
    } else {
      name = (item?.price?.product as Product)?.name;
    }
    return name;
  }

  // Is this price choice locked?
  isLocked(item) {
    return this.lockedChoices.some(choice => choice.id === item.price.id);
  }

  isEditable(item: LineItem) {
    // ad hoc prices cannot have quantity.
    if (item?.price?.ad_hoc) {
      return false;
    }

    // if the item has a bump amount, it cannot have quantity.
    if (item?.bump_amount) {
      return false;
    }

    if (this.editable !== null) return this.editable;
    return this.editLineItems;
  }

  isRemovable() {
    if (this.removable !== null) return this.removable;
    return this.removeLineItems;
  }

  render() {
    if (!!this.busy && !this.order?.line_items?.data?.length) {
      return (
        <sc-line-item>
          <sc-skeleton style={{ 'width': '50px', 'height': '50px', '--border-radius': '0' }} slot="image"></sc-skeleton>
          <sc-skeleton slot="title" style={{ width: '120px', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton slot="description" style={{ width: '60px', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton style={{ width: '120px', display: 'inline-block' }} slot="price"></sc-skeleton>
          <sc-skeleton style={{ width: '60px', display: 'inline-block' }} slot="price-description"></sc-skeleton>
        </sc-line-item>
      );
    }

    return (
      <div class="line-items">
        {(this.order?.line_items?.data || [])
          .sort((a, b) => {
            if (a.price?.id < b.price?.id) return -1;
            return a.price?.id > b.price?.id ? 1 : 0;
          })
          .map(item => {
            return (
              <div class="line-item">
                <sc-product-line-item
                  key={item.id}
                  imageUrl={(item?.price?.product as Product)?.image_url}
                  name={(item?.price?.product as Product)?.name}
                  max={(item?.price?.product as Product)?.purchase_limit}
                  editable={this.isEditable(item)}
                  removable={this.isRemovable()}
                  quantity={item.quantity}
                  fees={item?.fees?.data}
                  setupFeeTrialEnabled={item?.price?.setup_fee_trial_enabled}
                  amount={item.ad_hoc_amount !== null ? item.ad_hoc_amount : item.subtotal_amount}
                  scratchAmount={item.ad_hoc_amount == null && item?.scratch_amount}
                  currency={this.order?.currency}
                  trialDurationDays={item?.price?.trial_duration_days}
                  interval={!!item?.price && intervalString(item?.price, { showOnce: hasSubscription(this.order) })}
                  onScUpdateQuantity={e => this.updateQuantity(item, e.detail)}
                  onScRemove={() => this.removeLineItem(item)}
                />
              </div>
            );
          })}
      </div>
    );
  }
}

openWormhole(ScLineItems, ['order', 'busy', 'prices', 'lockedChoices', 'editLineItems', 'removeLineItems'], false);
