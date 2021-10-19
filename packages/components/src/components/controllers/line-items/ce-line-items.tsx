import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';

import { CheckoutSession, CheckoutState, LineItem, LineItemData } from '../../../types';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-line-items',
  styleUrl: 'ce-line-items.css',
  shadow: true,
})
export class CeLineItems {
  @Prop() checkoutSession: CheckoutSession;
  @Prop() state: CheckoutState;
  @Prop() lineItemData: Array<LineItemData>;
  @Prop() edit: boolean = true;

  @Event() ceUpdateLineItem: EventEmitter<{ id: string; amount: number }>;

  updateQuantity(item: LineItem, amount: number) {
    this.ceUpdateLineItem.emit({ id: item.id, amount });
  }

  render() {
    if (this.state === 'loading') {
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
        {this.checkoutSession?.line_items.map(item => {
          return (
            <ce-product-line-item
              key={item.id}
              imageUrl={item?.price?.metadata?.wp_attachment_src}
              name={`${item?.price?.product?.name} \u2013 ${item?.price?.name}`}
              edit={this.edit}
              quantity={item.quantity}
              amount={item.subtotal_amount}
              currency={this.checkoutSession?.currency}
              interval={item.price.recurring_interval ? `${item.price.recurring_interval}` : `once`}
              onCeUpdateQuantity={e => this.updateQuantity(item, e.detail)}
            ></ce-product-line-item>
          );
        })}
      </div>
    );
  }
}

openWormhole(CeLineItems, ['checkoutSession', 'state', 'lineItemData'], false);
