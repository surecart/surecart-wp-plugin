import { translatedInterval } from '../../../../functions/price';
import { Order, LineItem, LineItemData, PriceChoice, Prices, Product } from '../../../../types';
import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { hasSubscription } from '../../../../functions/line-items';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-line-items',
  styleUrl: 'sc-line-items.css',
  shadow: true,
})
export class ScLineItems {
  @Prop() order: Order;
  @Prop() loading: boolean;
  @Prop() prices: Prices;
  @Prop() editable: boolean = true;
  @Prop() removable: boolean = true;
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

  render() {
    if (!!this.loading) {
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
        {this.order?.line_items?.data.map(item => {
          return (
            <sc-product-line-item
              key={item.id}
              imageUrl={(item?.price?.product as Product)?.image_url}
              name={(item?.price?.product as Product)?.name}
              editable={this.editable && !item?.ad_hoc_amount}
              removable={this.removable}
              quantity={item.quantity}
              amount={item.ad_hoc_amount !== null ? item.ad_hoc_amount : item.price.amount * item.quantity}
              currency={this.order?.currency}
              trialDurationDays={item?.price?.trial_duration_days}
              interval={translatedInterval(item.price.recurring_interval_count, item.price.recurring_interval, __('every', 'surecart'), hasSubscription(this.order) ? 'once' : '')}
              onScUpdateQuantity={e => this.updateQuantity(item, e.detail)}
              onScRemove={() => this.removeLineItem(item)}
            ></sc-product-line-item>
          );
        })}
      </div>
    );
  }
}

openWormhole(ScLineItems, ['order', 'loading', 'prices', 'lockedChoices'], false);
