import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';

import { CheckoutSession, LineItem, LineItemData, Product } from '../../../types';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-line-items',
  styleUrl: 'ce-line-items.css',
  shadow: true,
})
export class CeLineItems {
  @Prop() checkoutSession: CheckoutSession;
  @Prop() loading: boolean;
  @Prop() lineItemData: Array<LineItemData>;
  @Prop() edit: boolean = true;
  @Prop() removeable: boolean = true;

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
        {this.checkoutSession?.line_items?.data.map(item => {
          return (
            <ce-product-line-item
              key={item.id}
              imageUrl={item?.price?.metadata?.wp_attachment_src}
              name={`${(item?.price?.product as Product)?.name} \u2013 ${item?.price?.name}`}
              edit={this.edit}
              isRemovable={this.removeable}
              quantity={item.quantity}
              amount={item.price.amount}
              currency={this.checkoutSession?.currency}
              interval={item.price.recurring_interval ? `${item.price.recurring_interval}` : `once`}
              onCeUpdateQuantity={e => this.updateQuantity(item, e.detail)}
              onCeRemove={() => this.removeLineItem(item)}
            ></ce-product-line-item>
          );
        })}
      </div>
    );
  }
}

openWormhole(CeLineItems, ['checkoutSession', 'loading', 'lineItemData'], false);
