import { translatedInterval } from '../../../functions/price';
import { Order, LineItem, LineItemData, PriceChoice, Prices, Product } from '../../../types';
import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-line-items',
  styleUrl: 'ce-line-items.css',
  shadow: true,
})
export class CeLineItems {
  @Prop() order: Order;
  @Prop() loading: boolean;
  @Prop() prices: Prices;
  @Prop() editable: boolean = true;
  @Prop() removable: boolean = true;
  @Prop() lockedChoices: Array<PriceChoice> = [];

  /** Update the line item. */
  @Event() ceUpdateLineItem: EventEmitter<LineItemData>;

  /** Remove the line item. */
  @Event() ceRemoveLineItem: EventEmitter<LineItemData>;

  /** Update quantity for this line item. */
  updateQuantity(item: LineItem, quantity: number) {
    this.ceUpdateLineItem.emit({ price_id: item.price.id, quantity });
  }

  removeLineItem(item: LineItem) {
    this.ceRemoveLineItem.emit({ price_id: item.price.id, quantity: 1 });
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
        <ce-line-item>
          <ce-skeleton style={{ 'width': '50px', 'height': '50px', '--border-radius': '0' }} slot="image"></ce-skeleton>
          <ce-skeleton slot="title" style={{ width: '120px', display: 'inline-block' }}></ce-skeleton>
          <ce-skeleton slot="description" style={{ width: '60px', display: 'inline-block' }}></ce-skeleton>
          <ce-skeleton style={{ width: '120px', display: 'inline-block' }} slot="price"></ce-skeleton>
          <ce-skeleton style={{ width: '60px', display: 'inline-block' }} slot="price-description"></ce-skeleton>
        </ce-line-item>
      );
    }

    return (
      <div class="line-items">
        {this.order?.line_items?.data.map(item => {
          return (
            <ce-product-line-item
              key={item.id}
              imageUrl={(item?.price?.product as Product)?.image_url}
              name={this.getName(item)}
              editable={this.editable}
              removable={this.removable}
              quantity={item.quantity}
              amount={item.ad_hoc_amount !== null ? item.ad_hoc_amount : item.price.amount * item.quantity}
              currency={this.order?.currency}
              trialDurationDays={item?.price?.trial_duration_days}
              interval={translatedInterval(item.price.recurring_interval_count, item.price.recurring_interval)}
              onCeUpdateQuantity={e => this.updateQuantity(item, e.detail)}
              onCeRemove={() => this.removeLineItem(item)}
            ></ce-product-line-item>
          );
        })}
      </div>
    );
  }
}

openWormhole(CeLineItems, ['order', 'loading', 'prices', 'lockedChoices'], false);
