import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';

import { CheckoutSession, LineItem, LineItemData } from '../../../types';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-line-items',
  styleUrl: 'ce-line-items.css',
  shadow: true,
})
export class CeLineItems {
  @Prop() checkoutSession: CheckoutSession;
  @Prop() loading: boolean;
  @Prop() calculating: boolean = false;
  @Prop() lineItemData: Array<LineItemData>;
  @Prop() edit: boolean = true;

  @Event() ceUpdateLineItem: EventEmitter<{ id: string; amount: number }>;

  updateQuantity(item: LineItem, amount: number) {
    this.ceUpdateLineItem.emit({ id: item.id, amount });
  }

  render() {
    if (this.loading || (this.calculating && !this?.checkoutSession?.line_items?.length)) {
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

    return this.checkoutSession?.line_items.map(item => {
      return (
        <ce-product-line-item
          imageUrl={item?.price?.meta_data?.wp_attachment_src}
          name={`${item?.price?.product?.name} \u2013 ${item?.price?.name}`}
          edit={this.edit}
          quantity={item.quantity}
          amount={item.amount_subtotal}
          currency={this.checkoutSession?.currency}
          interval={item.price.recurring_interval ? `${item.price.recurring_interval}` : `once`}
          onCeUpdateQuantity={e => this.updateQuantity(item, e.detail)}
        ></ce-product-line-item>
      );
    });
  }
}

openWormhole(CeLineItems, ['checkoutSession', 'loading', 'lineItemData', 'calculating'], false);
