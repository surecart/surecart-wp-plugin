import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';
import { Checkout, LineItem, Product } from '../../../../types';
import { groupBundleLineItems } from '../../../../functions/line-items';

@Component({
  tag: 'sc-order-confirmation-line-items',
  styleUrl: 'sc-order-confirmation-line-items.scss',
  shadow: true,
})
export class ScOrderConfirmationLineItems {
  @Prop() order: Checkout;
  @Prop() loading: boolean;

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

    const items = (this.order?.line_items?.data || []) as LineItem[];
    const { regular, bundleParents, componentsByParent } = groupBundleLineItems(items);
    const orderedItems = [...bundleParents, ...regular];

    return (
      <div class={{ 'confirmation-summary': true }}>
        <div class="line-items" part="line-items">
          {orderedItems.map(item => {
            const product = item?.price?.product as Product;
            const isBundle = !!product?.bundle;
            return (
              <div class="line-item" key={item.id}>
                <sc-product-line-item
                  image={product?.line_item_image}
                  name={product?.name}
                  price={item?.price?.name}
                  variant={item?.variant_display_options}
                  editable={false}
                  removable={false}
                  quantity={item.quantity}
                  fees={item?.fees?.data}
                  note={item?.display_note}
                  amount={item.ad_hoc_display_amount ? item.ad_hoc_display_amount : item.subtotal_display_amount}
                  scratch={!item.ad_hoc_display_amount && item?.scratch_display_amount}
                  trial={item?.price?.trial_text}
                  interval={`${item?.price?.short_interval_text} ${item?.price?.short_interval_count_text}`}
                  purchasableStatus={item?.purchasable_status_display}
                  sku={item?.sku}
                  bundleComponents={isBundle ? componentsByParent[item.id] || [] : []}
                ></sc-product-line-item>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

openWormhole(ScOrderConfirmationLineItems, ['order', 'busy', 'loading', 'empty'], false);
