import { translatedInterval } from '../../../../functions/price';
import { Order, Product } from '../../../../types';
import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-order-confirmation-line-items',
  styleUrl: 'ce-order-confirmation-line-items.scss',
  shadow: true,
})
export class CeOrderConfirmationLineItems {
  @Prop() order: Order;
  @Prop() loading: boolean;

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
      <div class={{ 'confirmation-summary': true }}>
        <div class="line-items" part="line-items">
          {this.order?.line_items?.data.map(item => {
            return (
              <ce-product-line-item
                key={item.id}
                imageUrl={(item?.price?.product as Product)?.image_url}
                name={`${(item?.price?.product as Product)?.name}`}
                editable={false}
                removable={false}
                quantity={item.quantity}
                amount={item.ad_hoc_amount !== null ? item.ad_hoc_amount : item.price.amount}
                currency={this.order?.currency}
                trialDurationDays={item?.price?.trial_duration_days}
                interval={translatedInterval(item.price.recurring_interval_count, item.price.recurring_interval, '', '')}
              ></ce-product-line-item>
            );
          })}
        </div>
      </div>
    );
  }
}

openWormhole(CeOrderConfirmationLineItems, ['order', 'busy', 'loading', 'empty'], false);
